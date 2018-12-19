import React from "react";
import { List, Icon, Card } from "antd";
import styles from "./ItemList.module.css";
import { collectorMachineInterface } from "../collector/Collector";

const ItemListDiscover = ({ items }) => {
  const { openItem, showWorkbench } = collectorMachineInterface;

  const numberOfItems = items.length;

  const listItemContent = item => {
    return (
      <List.Item>
        <div
          className={styles.listItemWrapper}
          onClick={() => {
            showWorkbench();
            openItem(item.id);
          }}
        >
          <span className={styles.listItemTitle}>{item.title}</span>
          <span className={styles.listItemIcons}>
            <Icon
              type="question-circle"
              theme={"outlined"}
              style={{ marginLeft: "8px", color: "#f5222d" }}
            />
          </span>
        </div>
      </List.Item>
    );
  };

  return (
    <div className={styles.wrapperDiscover}>
      <span className={styles.itemsCounter}>{`${numberOfItems}`}</span>
      <Card title="Doing">
        {items.length > 0 && (
          <List
            itemLayout="horizontal"
            dataSource={items}
            renderItem={item => listItemContent(item)}
          />
        )}
      </Card>
    </div>
  );
};

export default ItemListDiscover;
