import React, { useEffect, useRef } from "react";
import { collectorMachineInterface } from "../collector/Collector";
import useMachine from "./../common/useMachine";
import treasureMachine from "./treasureMachine";
import {
  Icon,
  Row,
  Col,
  Input,
  Button,
  Popconfirm,
  message,
  Modal
} from "antd";
import convertURL from "./../common/convertURL";
import TagGroup from "./../tag-group/TagGroup";
import styles from "./Treasure.module.css";

const { TextArea } = Input;

// IPC bus
const { ipcRenderer } = window.require("electron");
const { dialog } = window.require("electron").remote;

let updateImage;

ipcRenderer.on("has-image", (event, arg) => {
  updateImage(arg);
});

const Treasure = ({ item }) => {
  const { focusedItemID, todItemID } = collectorMachineInterface.context;

  const { commitItem, deleteItem, setTODItem } = collectorMachineInterface;

  const titleInputRef = useRef(null);
  const noteInputRef = useRef(null);
  const noteContentRef = useRef(null);
  const pictureInfoInputRef = useRef(null);

  const [state, send] = useMachine(
    treasureMachine.withConfig(
      {
        actions: {
          focusTitleInput() {
            setTimeout(() => {
              if (titleInputRef.current) {
                titleInputRef.current.select();
              }
            }, 0);
          },
          focusNoteInput() {
            setTimeout(() => {
              if (noteInputRef.current) {
                noteInputRef.current.focus();
              }
            }, 0);
          },
          focusPictureInfoInput() {
            setTimeout(() => {
              if (pictureInfoInputRef.current) {
                pictureInfoInputRef.current.select();
              }
            }, 0);
          }
        }
      },
      {
        titleInput: item.title,
        prevTitle: "",
        noteInput: item.note,
        prevNote: "",
        pictureModalName: "",
        pictureInfoInput: "",
        prevPictureInfo: ""
      }
    )
  );

  const {
    titleInput,
    noteInput,
    pictureModalName,
    pictureInfoInput
  } = state.context;

  let newItem = { ...item };

  updateImage = imageName => {
    newItem.pictures = newItem.pictures.concat({
      url: `./images/${imageName}`,
      info: "About this image"
    });
    commitItem(newItem);
  };

  useEffect(
    () => {
      send({ type: "RESET_INPUT_TITLE", value: item.title });
      send({ type: "RESET_INPUT_NOTE", value: item.note });
      send({ type: "SET_PICTURE_MODAL_NAME", value: "" });
      if (item.pictures.length > 0) {
        send("SHOW_PICTURE");
      } else {
        send("HIDE_PICTURE");
      }
    },
    [focusedItemID, item]
  );

  let modalPicture;

  if (item.pictures.length > 0 && pictureModalName) {
    modalPicture = item.pictures.find(
      picture => picture.url === pictureModalName
    );
  }

  return (
    <div className={styles.expandedWrapper}>
      <Row gutter={48}>
        <Col className="gutter-row" span={16}>
          {state.matches("titleEdit.standby") && (
            <h2
              className={styles.title}
              onClick={() => send("FOCUS_INPUT_TITLE")}
            >
              {item.title}
            </h2>
          )}
          {state.matches("titleEdit.input") && (
            <Input
              className={styles.titleInput}
              value={titleInput}
              onChange={e =>
                send({ type: "CHANGE_INPUT_TITLE", value: e.target.value })
              }
              onBlur={() => send("CANCEL_INPUT_TITLE")}
              onKeyDown={e => {
                if (e.key === "Escape") {
                  send("CANCEL_INPUT_TITLE");
                }
              }}
              onPressEnter={() => {
                if (titleInput.trim()) {
                  send("COMMIT_INPUT_TITLE");
                  newItem.title = titleInput.trim();
                  commitItem(newItem);
                }
              }}
              ref={titleInputRef}
            />
          )}
          <div className={styles.contentControl}>
            <span
              className={
                state.matches("pictureDisplay.show")
                  ? styles.pictureIconEnabled
                  : styles.contentIconDisabled
              }
              onClick={() => {
                if (state.matches("pictureDisplay.hide")) {
                  send("SHOW_PICTURE");
                } else {
                  send("HIDE_PICTURE");
                }
              }}
            >
              Picture
            </span>
            <span
              className={
                item.note
                  ? styles.contentIconEnabled
                  : styles.contentIconDisabled
              }
              onClick={() => {
                if (!item.note) {
                  newItem.note = "These are some thoughts to remember";
                  commitItem(newItem);
                }
              }}
            >
              Note
            </span>
          </div>
          {state.matches("pictureDisplay.show") && (
            <div className={styles.pictureTiles}>
              {item.pictures.map((picture, index) => {
                return (
                  <div
                    key={`${picture.url}-${index}`}
                    className={styles.pictureTile}
                  >
                    <img
                      className={styles.picture}
                      src={picture.url}
                      alt="a treasure"
                      onClick={() => {
                        send({
                          type: "SET_PICTURE_MODAL_NAME",
                          value: picture.url
                        });
                        send({
                          type: "SET_INPUT_PICTURE_INFO",
                          value: picture.info
                        });
                        send("OPEN_PICTURE_MODAL");
                      }}
                    />
                    <Icon
                      type="close"
                      style={{
                        position: "absolute",
                        top: "8px",
                        right: "8px",
                        color: "#f5222d",
                        cursor: "pointer"
                      }}
                      onClick={e => {
                        e.stopPropagation();
                        newItem.pictures = newItem.pictures.filter(
                          oldPic => oldPic.url !== picture.url
                        );
                        commitItem(newItem);
                      }}
                    />
                  </div>
                );
              })}
              <div
                className={styles.pictureTileDrop}
                onDragOver={e => {
                  e.preventDefault();
                  return false;
                }}
                onDragLeave={() => {
                  return false;
                }}
                onDragEnd={() => {
                  return false;
                }}
                onDrop={e => {
                  e.preventDefault();

                  let file;

                  if (e.dataTransfer.files.length > 0) {
                    file = e.dataTransfer.files[0];
                  }

                  if (file.type.includes("image")) {
                    ipcRenderer.send("drop-native-image", {
                      name: file.name,
                      path: file.path
                    });
                  }

                  return false;
                }}
                onClick={() => {
                  dialog.showOpenDialog(
                    {
                      filters: [
                        {
                          name: "image",
                          extensions: ["gif", "jpg", "jpeg", "png", "webp"]
                        }
                      ]
                    },
                    fileNames => {
                      if (fileNames === undefined) return;

                      const fileName = fileNames[0].replace(/^.*[\\\/]/, "");

                      let hasPicture;

                      for (let picture of item.pictures) {
                        if (picture.url.includes(fileName)) {
                          return (hasPicture = true);
                        }
                      }

                      if (!hasPicture) {
                        updateImage(fileName);
                      }
                    }
                  );
                }}
              >
                <span className={styles.pictureTileDropContent}>Drop</span>
              </div>
            </div>
          )}
          {modalPicture && (
            <Modal
              title={modalPicture.url}
              style={{ top: 20 }}
              width={900}
              visible={state.matches("pictureModal.show")}
              okButtonProps={{ style: { display: "none" } }}
              okText="Copy"
              cancelButtonProps={{ style: { display: "none" } }}
              onCancel={() => {
                send("CLOSE_PICTURE_MODAL");
              }}
            >
              {state.matches("pictureInfoEdit.standby") && (
                <p
                  className={styles.pictureInfo}
                  onClick={() => send("FOCUS_INPUT_PICTURE_INFO")}
                >
                  {modalPicture.info}
                </p>
              )}
              {state.matches("pictureInfoEdit.input") && (
                <Input
                  className={styles.pictureInfoInput}
                  value={pictureInfoInput}
                  onChange={e =>
                    send({
                      type: "CHANGE_INPUT_PICTURE_INFO",
                      value: e.target.value
                    })
                  }
                  onBlur={() => send("CANCEL_INPUT_PICTURE_INFO")}
                  onKeyDown={e => {
                    if (e.key === "Escape") {
                      e.stopPropagation();
                      send("CANCEL_INPUT_PICTURE_INFO");
                    }
                  }}
                  onPressEnter={() => {
                    if (pictureInfoInput.trim()) {
                      send("COMMIT_INPUT_PICTURE_INFO");
                      newItem.pictures = newItem.pictures.map(picture => {
                        if (picture.url === modalPicture.url) {
                          const newPicture = {
                            url: picture.url,
                            info: pictureInfoInput.trim()
                          };
                          return newPicture;
                        } else {
                          return picture;
                        }
                      });
                      commitItem(newItem);
                    }
                  }}
                  ref={pictureInfoInputRef}
                />
              )}
              <img
                src={modalPicture.url}
                className={styles.pictureModalImage}
                alt="a treasue"
              />
            </Modal>
          )}
          {item.note && (
            <div className={styles.noteContainer}>
              <Icon
                type="close"
                style={{
                  position: "absolute",
                  top: "8px",
                  right: "8px",
                  color: "#f5222d",
                  cursor: "pointer"
                }}
                onClick={e => {
                  e.stopPropagation();
                  newItem.note = "";
                  commitItem(newItem);
                }}
              />
              {state.matches("noteEdit.input") && (
                <TextArea
                  value={noteInput}
                  className={styles.noteInput}
                  style={{ height: noteContentRef.current.clientHeight }}
                  onChange={e => {
                    send({
                      type: "CHANGE_INPUT_NOTE",
                      value: e.target.value
                    });
                  }}
                  onKeyDown={e => {
                    if (e.key === "Escape") {
                      send("CANCEL_INPUT_NOTE");
                    }
                  }}
                  ref={noteInputRef}
                />
              )}
              {state.matches("noteEdit.input") && (
                <div
                  style={{
                    position: "absolute",
                    top: `${noteContentRef.current.clientHeight + 16}px`
                  }}
                >
                  <Button
                    style={{ marginRight: "16px" }}
                    onClick={() => {
                      send("CANCEL_INPUT_NOTE");
                    }}
                  >
                    Cancel
                  </Button>
                  <Button
                    type={"primary"}
                    onClick={() => {
                      if (noteInput.trim()) {
                        send("COMMIT_INPUT_NOTE");
                        newItem.note = noteInput.trim();
                        commitItem(newItem);
                      }
                    }}
                  >
                    Submit
                  </Button>
                </div>
              )}
              <div
                className={
                  state.matches("noteEdit.standby")
                    ? styles.noteContentShow
                    : styles.noteContentHide
                }
                ref={noteContentRef}
              >
                {item.note.split("\n").map((lineOfNote, key) => {
                  return (
                    <span
                      key={key}
                      dangerouslySetInnerHTML={convertURL(lineOfNote)}
                    />
                  );
                })}
              </div>
              <div
                className={
                  state.matches("noteEdit.standby")
                    ? styles.noteEditShow
                    : styles.noteEditHide
                }
              >
                <Button
                  type={"primary"}
                  onClick={() => send("FOCUS_INPUT_NOTE")}
                >
                  Edit Note
                </Button>
              </div>
            </div>
          )}
          <div className={styles.gap} />
        </Col>
        <Col className="gutter-row" span={8}>
          <Popconfirm
            title="Are you sure to delete this?"
            onConfirm={() => {
              message.warning("Item deleted", 1);
              deleteItem(item.id);
            }}
            onCancel={() => {
              message.info("Cancel delete", 1);
            }}
            okText="Yes"
            cancelText="No"
          >
            <Button type="danger" ghost>
              Delete
            </Button>
          </Popconfirm>
          {item.timeCreate && (
            <div className={styles.timeContainer}>
              <span>{item.timeCreate} - </span>
              <span>{item.timeLastModify}</span>
            </div>
          )}
          <h3
            className={
              item.discovered ? styles.discovered : styles.undiscovered
            }
            onClick={() => {
              newItem.discovered = !item.discovered;
              commitItem(newItem);
            }}
          >
            {item.discovered ? "Discovered" : "Undiscovered"}
          </h3>
          <h3
            className={item.id === todItemID ? styles.todYay : styles.todNay}
            onClick={() => {
              item.id === todItemID ? setTODItem("") : setTODItem(item.id);
            }}
          >
            Treasure of the Day
          </h3>
          <TagGroup item={item} />
          <p>{item.id}</p>
        </Col>
      </Row>
    </div>
  );
};

export default Treasure;
