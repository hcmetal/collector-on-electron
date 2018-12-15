import React from "react";
import styles from "./Exhibition.module.css";
import TreasureReadOnly from "../treasure/TreasureReadOnly";
import { Row, Col } from "antd";

const Exhibition = ({ items, todItemID, handleOpenItem, onShowWorkbench }) => {
  let todItem;

  if (items.length > 0 && todItemID) {
    todItem = items.find(item => item.id === todItemID);
  }

  return (
    <div className={styles.expandedWrapper}>
      <Row gutter={48}>
        <Col className="gutter-row" span={16}>
          <div className={styles.itemsContainer}>
            {todItem ? (
              <TreasureReadOnly
                item={todItem}
                handleOpenItem={handleOpenItem}
                handleOpenWorkbench={onShowWorkbench}
              />
            ) : (
              <span>Treasure of the day missing</span>
            )}
          </div>
        </Col>
        <Col className="gutter-row" span={8}>
          <span>yo</span>
        </Col>
      </Row>
    </div>
  );
};

export default Exhibition;
