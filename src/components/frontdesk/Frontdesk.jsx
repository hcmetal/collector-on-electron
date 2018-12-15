import React from "react";
import { Layout, Menu } from "antd";
import useMachine from "./../common/useMachine";
import frontdeskMachine from "./frontdeskMachine";
import Exhibition from "../exhibition/Exhibition";

const { Content } = Layout;

const Frontdesk = ({ items, todItemID, onOpenItem, onShowWorkbench }) => {
  const [state, send] = useMachine(frontdeskMachine);

  return (
    <>
      <Menu
        selectedKeys={state.matches("exhibition") ? ["1"] : ["2"]}
        mode="horizontal"
      >
        <Menu.Item
          key="1"
          onClick={() => {
            send("SHOW_EXHIBITION");
          }}
        >
          Exhibition
        </Menu.Item>
        <Menu.Item
          key="2"
          onClick={() => {
            send("SHOW_PLANNER");
          }}
        >
          Planner
        </Menu.Item>
      </Menu>
      <Content style={{ position: "relative" }}>
        {state.matches("exhibition") && (
          <Exhibition
            items={items}
            todItemID={todItemID}
            handleOpenItem={onOpenItem}
            onShowWorkbench={onShowWorkbench}
          />
        )}
      </Content>
    </>
  );
};

export default Frontdesk;
