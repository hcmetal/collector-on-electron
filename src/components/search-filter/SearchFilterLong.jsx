import React, { useRef } from "react";
import { Input, Button } from "antd";
import styles from "./SearchFilter.module.css";
import useMachine from "../common/useMachine";
import searchFilterMachine from "./searchFilterMachine";

const SearchFilter = () => {
  const inputRef = useRef(null);

  let searchTask;

  const [state, send] = useMachine(
    searchFilterMachine.withConfig({
      actions: {
        blurInput() {
          inputRef.current && inputRef.current.blur();
        },
        focusInput() {
          inputRef.current && inputRef.current.select();
        },
        notifySearch() {
          searchAndFilter();
        },
        cancelSearch() {
          cancelSearchAndFilter();
        }
      }
    })
  );

  const searchAndFilter = () => {
    searchTask = setTimeout(() => {
      send("SEARCH_SUCCESS");
    }, 2000);
  };

  const cancelSearchAndFilter = () => {
    console.log(`cleared task ${searchTask}`);
  };

  const searchFor = state.context.searchFor;

  return (
    <div
      className={styles.wrapper}
      data-search-filter-state={state.toStrings()}
    >
      <Input
        placeholder="Filter items by keyword"
        style={{
          borderRightWidth: "0px",
          borderTopRightRadius: "0px",
          borderBottomRightRadius: "0px"
        }}
        value={searchFor}
        onFocus={() => send("INPUT")}
        onBlur={() => send("BLUR")}
        onKeyDown={e => {
          if (e.key === "Escape") {
            send("CANCEL_INPUT");
          }
        }}
        onChange={e => send({ type: "CHANGE", value: e.target.value })}
        onPressEnter={() => send("COMMIT")}
        disabled={state.matches("searching") ? true : false}
        ref={inputRef}
      />
      {(state.matches("standby") || state.matches("input")) && (
        <Button
          type="primary"
          size="default"
          icon="filter"
          style={{
            borderTopLeftRadius: "0px",
            borderBottomLeftRadius: "0px"
          }}
          onClick={() => send("COMMIT")}
        />
      )}
      {state.matches("searching") && (
        <Button
          type="danger"
          size="default"
          icon="stop"
          style={{
            borderTopLeftRadius: "0px",
            borderBottomLeftRadius: "0px"
          }}
          onClick={() => send("CANCEL_SEARCH")}
        />
      )}
      {state.matches("success") && (
        <Button
          type="danger"
          size="default"
          icon="close"
          style={{
            borderTopLeftRadius: "0px",
            borderBottomLeftRadius: "0px"
          }}
          onClick={() => send("CLEAR_FILTER")}
        />
      )}
    </div>
  );
};

export default SearchFilter;
