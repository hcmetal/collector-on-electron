import React from "react";
import { List, Icon, Collapse } from "antd";
import styles from "./ItemList.module.css";
import { collectorMachineInterface } from "../collector/Collector";

const Panel = Collapse.Panel;

const ItemListQuest = () => {
  const { items, expandedQuestKeys } = collectorMachineInterface.context;
  const { openItem, showWorkbench, expandQuest } = collectorMachineInterface;

  const quests =
    items.filter(item => {
      return item.type === "collection" && item.isQuest;
    }) || [];

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
            {!item.discovered && (
              <Icon
                type="question-circle"
                theme={"outlined"}
                style={{ marginLeft: "8px", color: "#f5222d" }}
              />
            )}
          </span>
        </div>
      </List.Item>
    );
  };

  return (
    <div className={styles.wrapperQuest}>
      <Collapse
        activeKey={expandedQuestKeys}
        onChange={key => {
          // "key" is an array of all active panel keys
          expandQuest(key);
        }}
      >
        {quests.map(quest => {
          const steps = items.filter(item => {
            return (
              item.type === "treasure" && quest.treasureIDs.includes(item.id)
            );
          });

          return (
            <Panel header={quest.title} key={quest.id}>
              <List
                itemLayout="horizontal"
                dataSource={steps}
                renderItem={item => listItemContent(item)}
              />
            </Panel>
          );
        })}
      </Collapse>
    </div>
  );
};

export default ItemListQuest;
