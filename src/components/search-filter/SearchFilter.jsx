import React from "react";
import { Input } from "antd";
import styles from "./SearchFilter.module.css";
import { collectorMachineInterface } from "../collector/Collector";

const SearchFilter = () => {
  const { filterBy } = collectorMachineInterface.context;
  const { commitFilter } = collectorMachineInterface;

  return (
    <div className={styles.wrapper}>
      <Input
        placeholder="Filter items by keyword"
        value={filterBy}
        onChange={e => {
          commitFilter(e.target.value);
        }}
      />
    </div>
  );
};

export default SearchFilter;
