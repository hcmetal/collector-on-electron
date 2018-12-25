import React from "react";
import { Icon, List } from "antd";
import styles from "./Collection.module.css";
import { collectorMachineInterface } from "../collector/Collector";

const CollectionListItem = ({ item }) => {
  const { openedItemsIDs, focusedItemID } = collectorMachineInterface.context;

  const { openItem, showWorkbench } = collectorMachineInterface;

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
      </div>
    </List.Item>
  );
};

export default CollectionListItem;
