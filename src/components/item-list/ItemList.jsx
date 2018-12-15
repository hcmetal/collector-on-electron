import React from "react";
import { Collapse, List, Icon } from "antd";
import styles from "./ItemList.module.css";
import { capitalize } from "./../common/capitalize";
import Treasure from "./../treasure/Treasure";
import Collection from "./../collection/Collection";
import { filterList } from "./../common/filterList";

const Panel = Collapse.Panel;

const ItemList = ({
  type,
  items,
  openedItemsIDs,
  focusedItemID,
  todItemID,
  handleCreateItem,
  onOpenItem,
  collectionSlotSelected,
  onAddToCollection,
  inCurrentCollectionIDs,
  filterBy,
  handleShowWorkbench
}) => {
  const numberOfItems = items.length;

  const filteredItems = filterList(filterBy, items);
  const numberOfFileteredItems = filteredItems.length;

  const listItemContent = item => {
    if (type === "treasure")
      return (
        <Treasure
          item={item}
          openedItemsIDs={openedItemsIDs}
          focusedItemID={focusedItemID}
          todItemID={todItemID}
          mode={"list"}
          handleOpenItem={onOpenItem}
          collectionSlotSelected={collectionSlotSelected}
          handleAddToCollection={onAddToCollection}
          inCurrentCollectionIDs={inCurrentCollectionIDs}
          handleShowWorkbench={handleShowWorkbench}
        />
      );
    if (type === "collection")
      return (
        <Collection
          item={item}
          openedItemsIDs={openedItemsIDs}
          focusedItemID={focusedItemID}
          mode={"list"}
          handleOpenItem={onOpenItem}
          handleShowWorkbench={handleShowWorkbench}
        />
      );
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
                    handleShowWorkbench();
                    handleCreateItem(type);
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
