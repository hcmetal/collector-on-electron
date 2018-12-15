import React, { useEffect, useRef } from "react";
import useMachine from "./../common/useMachine";
import treasureMachine from "./treasureMachine";
import TagGroup from "./../tag-group/TagGroup";
import {
  Icon,
  List,
  Row,
  Col,
  Input,
  Button,
  Popconfirm,
  message,
  Modal
} from "antd";
import styles from "./Treasure.module.css";
import convertURL from "./../common/convertURL";

const { TextArea } = Input;

const { ipcRenderer } = window.require("electron");

let updateImage;

ipcRenderer.on("has-image", (event, arg) => {
  updateImage(arg);
});

const Treasure = ({
  item,
  openedItemsIDs,
  focusedItemID,
  todItemID,
  mode,
  handleOpenItem,
  handleCommitItem,
  handleDeleteItem,
  handleSetTODItem,
  collectionSlotSelected,
  handleAddToCollection,
  inCurrentCollectionIDs,
  handleShowWorkbench
}) => {
  const titleInputRef = useRef(null);
  const noteInputRef = useRef(null);
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
    handleCommitItem(newItem);
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

  const eyeColor = focusedItemID === item.id ? "#1890ff" : "#cccccc";

  let modalPicture;

  if (item.pictures.length > 0 && pictureModalName) {
    modalPicture = item.pictures.find(
      picture => picture.url === pictureModalName
    );
  }

  if (mode === "list")
    return (
      <List.Item>
        <div
          className={styles.listItemWrapper}
          onClick={() => {
            handleShowWorkbench();
            handleOpenItem(item.id);
          }}
        >
          {openedItemsIDs.includes(item.id) && (
            <Icon
              type="eye"
              theme={"filled"}
              style={{ marginRight: "8px", color: eyeColor }}
            />
          )}
          {item.title}
          <span className={styles.listItemIcons}>
            {item.id === todItemID && (
              <Icon
                type="trophy"
                theme={"filled"}
                style={{ marginLeft: "8px", color: "#ffc200" }}
              />
            )}
            {!item.discovered && (
              <Icon
                type="question-circle"
                theme={"outlined"}
                style={{ marginLeft: "8px", color: "#f5222d" }}
              />
            )}
            {collectionSlotSelected &&
              !inCurrentCollectionIDs.includes(item.id) && (
                <Icon
                  type="plus"
                  theme={"outlined"}
                  style={{ marginLeft: "24px", color: "#00dd00" }}
                  onClick={e => {
                    e.stopPropagation();
                    handleAddToCollection(item.id);
                  }}
                />
              )}
          </span>
        </div>
      </List.Item>
    );

  if (mode === "expanded")
    return (
      <div className={styles.expandedWrapper}>
        <Row gutter={48}>
          <Col className="gutter-row" span={16}>
            {state.matches("titleEdit.standby") && (
              <h1
                className={styles.title}
                onClick={() => send("FOCUS_INPUT_TITLE")}
              >
                {item.title}
              </h1>
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
                    handleCommitItem(newItem);
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
                    handleCommitItem(newItem);
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
                          handleCommitItem(newItem);
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
                >
                  <span className={styles.pictureTileDropContent}>Drop</span>
                </div>
              </div>
            )}
            {modalPicture && (
              <Modal
                title={modalPicture.url}
                width={800}
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
                        handleCommitItem(newItem);
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
                    handleCommitItem(newItem);
                  }}
                />
                {state.matches("noteEdit.input") && (
                  <TextArea
                    rows={9}
                    value={noteInput}
                    className={styles.noteInput}
                    onChange={e =>
                      send({ type: "CHANGE_INPUT_NOTE", value: e.target.value })
                    }
                    onKeyDown={e => {
                      if (e.key === "Escape") {
                        send("CANCEL_INPUT_NOTE");
                      }
                    }}
                    ref={noteInputRef}
                  />
                )}
                {state.matches("noteEdit.input") && (
                  <div>
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
                          handleCommitItem(newItem);
                        }
                      }}
                    >
                      Submit
                    </Button>
                  </div>
                )}
                {state.matches("noteEdit.standby") && (
                  <div className={styles.noteContent}>
                    {item.note.split("\n").map((lineOfNote, key) => {
                      return (
                        <span
                          key={key}
                          dangerouslySetInnerHTML={convertURL(lineOfNote)}
                        />
                      );
                    })}
                    <div className={styles.noteEdit}>
                      <Button
                        type={"primary"}
                        onClick={() => send("FOCUS_INPUT_NOTE")}
                      >
                        Edit Note
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </Col>
          <Col className="gutter-row" span={8}>
            <Popconfirm
              title="Are you sure to delete this?"
              onConfirm={() => {
                message.warning("Item deleted", 1);
                handleDeleteItem(item.id);
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
                handleCommitItem(newItem);
              }}
            >
              {item.discovered ? "Discovered" : "Undiscovered"}
            </h3>
            <h3
              className={item.id === todItemID ? styles.todYay : styles.todNay}
              onClick={() => {
                item.id === todItemID
                  ? handleSetTODItem("")
                  : handleSetTODItem(item.id);
              }}
            >
              Treasure of the Day
            </h3>
            <TagGroup item={item} handleCommitItem={handleCommitItem} />
            <p>{item.id}</p>
          </Col>
        </Row>
      </div>
    );
};

export default Treasure;
