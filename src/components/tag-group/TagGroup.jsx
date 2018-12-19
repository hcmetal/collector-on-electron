import React, { useEffect, useRef } from "react";
import useMachine from "./../common/useMachine";
import { Tag, Input, Tooltip, Icon } from "antd";
import tagGroupMachine from "./tagGroupMachine";
import { collectorMachineInterface } from "../collector/Collector";

const TagGroup = ({ item }) => {
  const { commitItem } = collectorMachineInterface;

  const saveInputRef = useRef(null);

  const [state, send] = useMachine(
    tagGroupMachine.withConfig({
      actions: {
        focusInput() {
          setTimeout(() => {
            if (saveInputRef.current) {
              saveInputRef.current.focus();
            }
          }, 0);
        }
      }
    })
  );

  const { inputValue } = state.context;

  const tags = item.tags;

  let newItem = { ...item };

  useEffect(
    () => {
      newItem = { ...item };
      send({ type: "RESET_INPUT", value: "" });
    },
    [item]
  );

  return (
    <div>
      {tags.length > 0 &&
        tags.map(tag => {
          const isLongTag = tag.length > 20;

          const tagElem = (
            <Tag
              key={tag}
              closable={true}
              afterClose={() => {
                const newTags = tags.filter(originalTag => originalTag !== tag);
                newItem.tags = newTags;
                commitItem(newItem);
              }}
              style={{
                marginBottom: "8px"
              }}
            >
              {isLongTag ? `${tag.slice(0, 20)}...` : tag}
            </Tag>
          );

          return isLongTag ? (
            <Tooltip title={tag} key={tag}>
              {tagElem}
            </Tooltip>
          ) : (
            tagElem
          );
        })}
      {state.matches("input") && (
        <Input
          ref={saveInputRef}
          type="text"
          size="small"
          style={{ width: 78 }}
          value={inputValue}
          onChange={e => send({ type: "CHANGE_INPUT", value: e.target.value })}
          onBlur={() => send("CANCEL_INPUT")}
          onKeyDown={e => {
            if (e.key === "Escape") {
              send("CANCEL_INPUT");
            }
          }}
          onPressEnter={() => {
            if (inputValue.trim()) {
              send("COMMIT_INPUT");
              const newTags = tags.concat(inputValue);
              newItem.tags = newTags;
              commitItem(newItem);
            }
          }}
        />
      )}
      {state.matches("standby") && (
        <Tag
          onClick={() => send("FOCUS_INPUT")}
          style={{
            background: "#fff",
            borderStyle: "dashed",
            marginBottom: "8px"
          }}
        >
          <Icon type="plus" /> New Tag
        </Tag>
      )}
    </div>
  );
};

export default TagGroup;
