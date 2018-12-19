import React from "react";
import styles from "./Exhibition.module.css";
import TreasureReadOnly from "../treasure/TreasureReadOnly";
import { Row, Col } from "antd";
import ItemListDiscover from "../item-list/ItemListDiscover";
import { collectorMachineInterface } from "../collector/Collector";

const Exhibition = () => {
  const { items, todItemID } = collectorMachineInterface.context;

  let todItem;

  if (items.length > 0 && todItemID) {
    todItem = items.find(item => item.id === todItemID);
  }

  const undiscoveredTreasures =
    items.filter(item => {
      return item.type === "treasure" && !item.discovered;
    }) || [];

  return (
    <div className={styles.expandedWrapper}>
      <Row gutter={48}>
        <Col
          className="gutter-row"
          span={16}
          style={{ height: "calc(100vh - 168px)" }}
        >
          {todItem ? (
            <div className={styles.itemsContainer}>
              <TreasureReadOnly item={todItem} />
            </div>
          ) : (
            <h1 className={styles.emptyContent}>No TOD</h1>
          )}
        </Col>
        <Col className="gutter-row" span={8}>
          <ItemListDiscover items={undiscoveredTreasures} />
        </Col>
      </Row>
    </div>
  );
};

export default Exhibition;
