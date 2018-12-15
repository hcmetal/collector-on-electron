import React from "react";
import SearchFilter from "../search-filter/SearchFilter";
import ItemList from "../item-list/ItemList";
import styles from "./Safe.module.css";

const Safe = ({
  items,
  openedItemsIDs,
  focusedItemID,
  todItemID,
  onCreateItem,
  onOpenItem,
  collectionSlotSelected,
  onAddToCollection,
  inCurrentCollectionIDs,
  filterBy,
  onCommitFilter,
  onShowWorkbench
}) => {
  const treasures = items.filter(item => item.type === "treasure");
  const collections = items.filter(item => item.type === "collection");

  return (
    <div className={styles.safe}>
      <SearchFilter filterBy={filterBy} handleCommitFilter={onCommitFilter} />
      <ItemList
        type={"treasure"}
        items={treasures}
        openedItemsIDs={openedItemsIDs}
        focusedItemID={focusedItemID}
        todItemID={todItemID}
        handleCreateItem={onCreateItem}
        onOpenItem={onOpenItem}
        collectionSlotSelected={collectionSlotSelected}
        onAddToCollection={onAddToCollection}
        inCurrentCollectionIDs={inCurrentCollectionIDs}
        filterBy={filterBy}
        handleShowWorkbench={onShowWorkbench}
      />
      <ItemList
        type={"collection"}
        items={collections}
        openedItemsIDs={openedItemsIDs}
        focusedItemID={focusedItemID}
        todItemID={todItemID}
        handleCreateItem={onCreateItem}
        onOpenItem={onOpenItem}
        filterBy={filterBy}
        handleShowWorkbench={onShowWorkbench}
      />
    </div>
  );
};

export default Safe;
