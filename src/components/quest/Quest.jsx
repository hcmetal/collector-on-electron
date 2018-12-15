import React, { useRef, useEffect } from "react";
import useMachine from "./../common/useMachine";
import questMachine from "./questMachine";
import TagGroup from "./../tag-group/TagGroup";
import { Icon, List, Row, Col, Input, Button } from "antd";
import styles from "./Quest.module.css";

const Quest = ({
  item,
  openedItemsIDs,
  focusedItemID,
  mode,
  handleOpenItem,
  handleCommitItem,
  handleDeleteItem
}) => {
  const titleInputRef = useRef(null);

  const [state, send] = useMachine(
    questMachine.withConfig(
      {
        actions: {
          focusTitleInput() {
            setTimeout(() => {
              if (titleInputRef.current) {
                titleInputRef.current.select();
              }
            }, 0);
          }
        }
      },
      {
        titleInput: item.title,
        prevTitle: ""
      }
    )
  );

  const { titleInput } = state.context;

  let newItem = { ...item };

  useEffect(
    () => {
      send({ type: "RESET_INPUT_TITLE", value: item.title });
    },
    [focusedItemID, item]
  );

  const eyeColor = focusedItemID === item.id ? "#1890ff" : "#cccccc";

  if (mode === "list")
    return (
      <List.Item>
        <div
          className={styles.listItemWrapper}
          onClick={() => {
            handleOpenItem(item.id);
          }}
        >
          {openedItemsIDs.includes(item.id) && (
            <Icon
              type="eye"
              theme={"filled"}
              style={{ marginRight: "8px", color: eyeColor }}
            />
          )}
          {item.title}
        </div>
      </List.Item>
    );

  if (mode === "expanded")
    return (
      <div className={styles.expandedWrapper}>
        <Row gutter={48}>
          <Col className="gutter-row" span={16}>
            {state.matches("titleEdit.standby") && (
              <h2
                className={styles.title}
                onClick={() => send("FOCUS_INPUT_TITLE")}
              >
                {item.title}
              </h2>
            )}
            {state.matches("titleEdit.input") && (
              <Input
                className={styles.titleInput}
                value={titleInput}
                onChange={e =>
                  send({ type: "CHANGE_INPUT_TITLE", value: e.target.value })
                }
                onBlur={() => send("CANCEL_INPUT_TITLE")}
                onKeyDown={e => {
                  if (e.key === "Escape") {
                    send("CANCEL_INPUT_TITLE");
                  }
                }}
                onPressEnter={() => {
                  if (titleInput.trim()) {
                    send("COMMIT_INPUT_TITLE");
                    newItem.title = titleInput.trim();
                    handleCommitItem(newItem);
                  }
                }}
                ref={titleInputRef}
              />
            )}
          </Col>
          <Col className="gutter-row" span={8}>
            <Button
              type="danger"
              ghost
              onClick={() => {
                handleDeleteItem(item.id);
              }}
            >
              Delete
            </Button>
            <p> </p>
            <TagGroup item={item} handleCommitItem={handleCommitItem} />
            <p>{item.id}</p>
          </Col>
        </Row>
      </div>
    );
};

export default Quest;
