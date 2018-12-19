import React from "react";
import { collectorMachineInterface } from "../collector/Collector";
import { Collapse, List, Icon } from "antd";
import { capitalize } from "./../common/capitalize";
import { filterList } from "./../common/filterList";
import TreasureListItem from "./../treasure/TreasureListItem";
import CollectionListItem from "./../collection/CollectionListItem";
import styles from "./ItemList.module.css";

const Panel = Collapse.Panel;

const ItemList = ({ type, items }) => {
  const { filterBy } = collectorMachineInterface.context;

  const { createItem, showWorkbench } = collectorMachineInterface;

  const numberOfItems = items.length;

  const filteredItems = filterList(filterBy, items);
  const numberOfFileteredItems = filteredItems.length;

  const listItemContent = item => {
    if (type === "treasure") return <TreasureListItem item={item} />;
    if (type === "collection") return <CollectionListItem item={item} />;
  };

  return (
    <div className={styles.wrapper}>
      <span
        className={styles.itemsCounter}
      >{`${numberOfFileteredItems}/${numberOfItems}`}</span>
      <Collapse bordered={false} defaultActiveKey={["1"]}>
        <Panel header={`${capitalize(type)}s`} key="1">
          <List
            itemLayout="horizontal"
            dataSource={[{ title: `New ${capitalize(type)}` }]}
            renderItem={item => (
              <List.Item>
                <span
                  className={styles.createNewItem}
                  onClick={() => {
                    showWorkbench();
                    createItem(type);
                  }}
                >
                  <Icon type="plus" /> {item.title}
                </span>
              </List.Item>
            )}
          />
          {numberOfFileteredItems > 0 && (
            <List
              itemLayout="horizontal"
              dataSource={filteredItems}
              renderItem={item => listItemContent(item)}
            />
          )}
        </Panel>
      </Collapse>
    </div>
  );
};

export default ItemList;
