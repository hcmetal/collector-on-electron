import React from "react";
import { Layout, Menu } from "antd";
import Exhibition from "../exhibition/Exhibition";
import Planner from "../planner/Planner";
import { collectorMachineInterface } from "../collector/Collector";

const { Content } = Layout;

const Frontdesk = () => {
  const { frontdeskMode } = collectorMachineInterface.context;
  const { showExhibition, showPlanner } = collectorMachineInterface;

  return (
    <>
      <Menu
        selectedKeys={frontdeskMode === "exhibition" ? ["1"] : ["2"]}
        mode="horizontal"
      >
        <Menu.Item
          key="1"
          onClick={() => {
            showExhibition();
          }}
        >
          Exhibition
        </Menu.Item>
        <Menu.Item
          key="2"
          onClick={() => {
            showPlanner();
          }}
        >
          Planner
        </Menu.Item>
      </Menu>
      <Content style={{ position: "relative" }}>
        {frontdeskMode === "exhibition" && <Exhibition />}
        {frontdeskMode === "planner" && <Planner />}
      </Content>
    </>
  );
};

export default Frontdesk;
