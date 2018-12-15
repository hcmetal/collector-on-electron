import React, { useRef, useEffect } from "react";
import useMachine from "./../common/useMachine";
import collectionMachine from "./collectionMachine";
import TagGroup from "./../tag-group/TagGroup";
import { Icon, List, Row, Col, Input, Button, Popconfirm, message } from "antd";
import styles from "./Collection.module.css";
import TreasureReadOnly from "../treasure/TreasureReadOnly";

const Collection = ({
  items,
  item,
  openedItemsIDs,
  focusedItemID,
  mode,
  handleOpenItem,
  handleCommitItem,
  handleDeleteItem,
  handleToggleCollectionSlot,
  addToCollectionItemID,
  handleAddToCollection,
  handleSetInCurrentCollectionIDs,
  handleShowWorkbench
}) => {
  const titleInputRef = useRef(null);

  const [state, send] = useMachine(
    collectionMachine.withConfig(
      {
        actions: {
          focusTitleInput() {
            setTimeout(() => {
              if (titleInputRef.current) {
                titleInputRef.current.select();
              }
            }, 0);
          }
        }
      },
      {
        titleInput: item.title,
        prevTitle: "",
        slotIndex: ""
      }
    )
  );

  const { titleInput, slotIndex } = state.context;

  let newItem = { ...item };

  useEffect(
    () => {
      send({ type: "RESET_INPUT_TITLE", value: item.title });
    },
    [focusedItemID, item]
  );

  useEffect(
    () => {
      if (addToCollectionItemID) {
        newItem.treasureIDs.splice(slotIndex, 0, addToCollectionItemID);
        handleCommitItem(newItem);
        handleAddToCollection("");
      }
    },
    [addToCollectionItemID]
  );

  const eyeColor = focusedItemID === item.id ? "#1890ff" : "#cccccc";

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
            <div className={styles.itemsContainer}>
              <Button
                className={styles.slotBar}
                onClick={e => {
                  e.stopPropagation();
                  send({ type: "CHOOSE_SLOT", value: "0" });
                  handleToggleCollectionSlot(true);
                  handleSetInCurrentCollectionIDs(item.treasureIDs);
                }}
              />
              {item.treasureIDs.map((id, index) => {
                const treasureItem = items.find(item => item.id === id);
                if (!treasureItem) {
                  newItem.treasureIDs = item.treasureIDs.filter(
                    treasureID => treasureID !== id
                  );
                  handleCommitItem(newItem);
                  return null;
                } else {
                  return (
                    <div key={id + index} className={styles.itemWrapper}>
                      <TreasureReadOnly
                        item={treasureItem}
                        handleOpenItem={handleOpenItem}
                      />
                      <Button
                        className={styles.slotBar}
                        onClick={e => {
                          e.stopPropagation();
                          send({ type: "CHOOSE_SLOT", value: ++index });
                          handleToggleCollectionSlot(true);
                          handleSetInCurrentCollectionIDs(item.treasureIDs);
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
                          newItem.treasureIDs = newItem.treasureIDs.filter(
                            treasureID => treasureID !== id
                          );
                          handleCommitItem(newItem);
                        }}
                      />
                    </div>
                  );
                }
              })}
            </div>
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
            <TagGroup item={item} handleCommitItem={handleCommitItem} />
            <p>{item.id}</p>
            <p>Current Slot Index: {slotIndex || "none"}</p>
          </Col>
        </Row>
      </div>
    );
};

export default Collection;
