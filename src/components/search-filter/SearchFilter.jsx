import React from "react";
import { Input } from "antd";
import styles from "./SearchFilter.module.css";

const SearchFilter = ({ filterBy, handleCommitFilter }) => {
  return (
    <div className={styles.wrapper}>
      <Input
        placeholder="Filter items by keyword"
        value={filterBy}
        onChange={e => {
          handleCommitFilter(e.target.value);
        }}
      />
    </div>
  );
};

export default SearchFilter;
