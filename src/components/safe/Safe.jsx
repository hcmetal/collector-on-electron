import React from "react";
import SearchFilter from "../search-filter/SearchFilter";
import ItemList from "../item-list/ItemList";
import styles from "./Safe.module.css";
import { collectorMachineInterface } from "../collector/Collector";

const Safe = () => {
  const { items } = collectorMachineInterface.context;
  const treasures = items.filter(item => item.type === "treasure");
  const collections = items.filter(item => item.type === "collection");

  return (
    <div className={styles.safe}>
      <SearchFilter />
      <ItemList type={"treasure"} items={treasures} />
      <ItemList type={"collection"} items={collections} />
    </div>
  );
};

export default Safe;
