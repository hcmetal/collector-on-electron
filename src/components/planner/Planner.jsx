import React from "react";
import styles from "./Planner.module.css";
import { Row, Col } from "antd";
import ItemListQuest from "../item-list/ItemListQuest";
import { collectorMachineInterface } from "../collector/Collector";

const Planner = () => {
  const { items } = collectorMachineInterface.context;

  return (
    <div className={styles.expandedWrapper}>
      <Row gutter={4}>
        <Col
          className="gutter-row"
          span={8}
          style={{ height: "calc(100vh - 168px)" }}
        >
          {items.length > 0 && <ItemListQuest />}
        </Col>
        <Col className="gutter-row" span={16}>
          <p>calendar</p>
        </Col>
      </Row>
    </div>
  );
};

export default Planner;
