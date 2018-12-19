import React, { useRef, useEffect } from "react";
import useMachine from "./../common/useMachine";
import collectionMachine from "./collectionMachine";
import TagGroup from "./../tag-group/TagGroup";
import { Icon, Row, Col, Input, Button, Popconfirm, message } from "antd";
import styles from "./Collection.module.css";
import TreasureReadOnly from "../treasure/TreasureReadOnly";
import { collectorMachineInterface } from "../collector/Collector";

const Collection = ({ item }) => {
  const {
    items,
    focusedItemID,
    addToCollectionItemID
  } = collectorMachineInterface.context;

  const {
    commitItem,
    deleteItem,
    toggleCollectionSlot,
    addToCollection,
    setInCurrentCollectionIDs
  } = collectorMachineInterface;

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
        commitItem(newItem);
        addToCollection("");
      }
    },
    [addToCollectionItemID]
  );

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
                  commitItem(newItem);
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
                toggleCollectionSlot(true);
                setInCurrentCollectionIDs(item.treasureIDs);
              }}
            />
            {item.treasureIDs.map((id, index) => {
              const treasureItem = items.find(item => item.id === id);
              if (!treasureItem) {
                newItem.treasureIDs = item.treasureIDs.filter(
                  treasureID => treasureID !== id
                );
                commitItem(newItem);
                return null;
              } else {
                return (
                  <div key={id + index} className={styles.itemWrapper}>
                    <TreasureReadOnly item={treasureItem} />
                    <Button
                      className={styles.slotBar}
                      onClick={e => {
                        e.stopPropagation();
                        send({ type: "CHOOSE_SLOT", value: ++index });
                        toggleCollectionSlot(true);
                        setInCurrentCollectionIDs(item.treasureIDs);
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
                        commitItem(newItem);
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
            className={item.isQuest ? styles.isQuest : styles.notQuest}
            onClick={() => {
              newItem.isQuest = !item.isQuest;
              commitItem(newItem);
            }}
          >
            {item.isQuest ? "Is a quest" : "Not a quest"}
          </h3>
          <TagGroup item={item} />
          <p>{item.id}</p>
          <p>Current Slot Index: {slotIndex || "none"}</p>
        </Col>
      </Row>
    </div>
  );
};

export default Collection;
