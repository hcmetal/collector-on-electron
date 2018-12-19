import React from "react";
import { Icon, List } from "antd";
import styles from "./Treasure.module.css";
import { collectorMachineInterface } from "../collector/Collector";

const TreasureListItem = ({ item }) => {
  const {
    openedItemsIDs,
    focusedItemID,
    todItemID,
    collectionSlotSelected,
    inCurrentCollectionIDs
  } = collectorMachineInterface.context;

  const {
    openItem,
    addToCollection,
    showWorkbench
  } = collectorMachineInterface;

  const eyeColor = focusedItemID === item.id ? "#1890ff" : "#cccccc";

  return (
    <List.Item>
      <div
        className={styles.listItemWrapper}
        onClick={() => {
          showWorkbench();
          openItem(item.id);
        }}
      >
        {openedItemsIDs.includes(item.id) && (
          <Icon
            type="eye"
            theme={"filled"}
            style={{ marginRight: "8px", color: eyeColor }}
          />
        )}
        <span className={styles.listItemTitle}>{item.title}</span>
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
          {collectionSlotSelected && !inCurrentCollectionIDs.includes(item.id) && (
            <Icon
              type="plus"
              theme={"outlined"}
              style={{ marginLeft: "24px", color: "#00dd00" }}
              onClick={e => {
                e.stopPropagation();
                addToCollection(item.id);
              }}
            />
          )}
        </span>
      </div>
    </List.Item>
  );
};

export default TreasureListItem;
