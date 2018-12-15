import React from "react";
import { Layout, Menu, Icon } from "antd";
import styles from "./Workbench.module.css";
import Treasure from "../treasure/Treasure";
import Collection from "./../collection/Collection";
import Quest from "./../quest/Quest";

const { Content } = Layout;

const Workbench = ({
  items,
  openedItemsIDs,
  focusedItemID,
  todItemID,
  onOpenItem,
  handleCloseItem,
  handleFocusItem,
  onCommitItem,
  onDeleteItem,
  onSetTODItem,
  onToggleCollectionSlot,
  addToCollectionItemID,
  onAddToCollection,
  onSetInCurrentCollectionIDs
}) => {
  // Arrange opened tabs in the order of open events
  const openedItems = openedItemsIDs.map(id =>
    items.find(item => item.id === id)
  );

  const focusedItem = items.filter(item => item.id === focusedItemID)[0];

  const content = focusedItem => {
    if (focusedItem.type === "treasure")
      return (
        <Treasure
          item={focusedItem}
          focusedItemID={focusedItemID}
          todItemID={todItemID}
          mode={"expanded"}
          handleCommitItem={onCommitItem}
          handleDeleteItem={onDeleteItem}
          handleSetTODItem={onSetTODItem}
        />
      );
    if (focusedItem.type === "collection")
      return (
        <Collection
          items={items}
          item={focusedItem}
          focusedItemID={focusedItemID}
          mode={"expanded"}
          handleCommitItem={onCommitItem}
          handleOpenItem={onOpenItem}
          handleDeleteItem={onDeleteItem}
          handleToggleCollectionSlot={onToggleCollectionSlot}
          addToCollectionItemID={addToCollectionItemID}
          handleAddToCollection={onAddToCollection}
          handleSetInCurrentCollectionIDs={onSetInCurrentCollectionIDs}
        />
      );
    if (focusedItem.type === "quest")
      return (
        <Quest
          item={focusedItem}
          focusedItemID={focusedItemID}
          mode={"expanded"}
          handleCommitItem={onCommitItem}
          handleDeleteItem={onDeleteItem}
        />
      );
  };

  const emptyContent = () => {
    return <h1 className={styles.emptyContent}>Get Stuff From The Safe</h1>;
  };

  return (
    <>
      <Menu
        selectedKeys={focusedItemID ? [focusedItemID] : [""]}
        mode="horizontal"
      >
        {openedItems.length > 0 &&
          openedItems.map(item => {
            return (
              <Menu.Item
                key={item.id}
                onClick={() => {
                  handleFocusItem(item.id);
                }}
              >
                <span>{item.title}</span>
                <Icon
                  type="close"
                  style={{
                    marginLeft: "10px",
                    marginRight: "-8px",
                    color: "#f5222d"
                  }}
                  onClick={e => {
                    // Stop click event from bubbling to the parents
                    e.stopPropagation();
                    handleCloseItem(item.id);
                  }}
                />
              </Menu.Item>
            );
          })}
      </Menu>
      <Content style={{ position: "relative" }}>
        {focusedItemID ? content(focusedItem) : emptyContent()}
      </Content>
    </>
  );
};

export default Workbench;
