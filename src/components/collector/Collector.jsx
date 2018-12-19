import React from "react";
import { Layout, Menu, Icon } from "antd";
import useMachine from "./../common/useMachine";
import collectorMachine, { collectorDefaultContext } from "./collectorMachine";
import Safe from "../safe/Safe";
import Workbench from "../workbench/Workbench";
import Frontdesk from "../frontdesk/Frontdesk";
import styles from "./Collector.module.css";

const { Header, Sider, Footer } = Layout;

// Set up ipcRenderer to interact with the main process
// Hack to access to Electron in React
export const { ipcRenderer } = window.require("electron");

ipcRenderer.on("report", (event, arg) => {
  console.log(arg);
});

// Leave ipcRenderer.on(...) out of the sfc to avoid repeatedly creating listeners
// which leads to memory leak
let sendToCollectorMachine;

export const collectorMachineInterface = {};

ipcRenderer.once("send-context", (event, context) => {
  sendToCollectorMachine({ type: "LOAD_CONTEXT", context });
});

const Collector = () => {
  const persistedCollectorMachine = collectorMachine.withConfig(
    {
      actions: {
        persist: ctx => {
          ipcRenderer.send("persist-items", ctx.items);
          ipcRenderer.send(
            "persist-tod-item-ID",
            JSON.stringify(ctx.todItemID)
          );
        }
      }
    },
    // Replace (not merge!!) context
    collectorDefaultContext
  );

  const [state, send] = useMachine(persistedCollectorMachine);
  sendToCollectorMachine = send;

  ipcRenderer.send("load-context");

  collectorMachineInterface.context = state.context;

  const { collectionSlotSelected } = state.context;

  collectorMachineInterface.createItem = type => {
    send({ type: "CREATE_ITEM", value: type });
  };

  collectorMachineInterface.commitItem = item => {
    const d = new Date();
    item.timeLastModify = `${d.getFullYear()}/${d.getMonth() +
      1}/${d.getDate()}`;
    send({ type: "COMMIT_ITEM", item });
  };

  collectorMachineInterface.deleteItem = id => {
    send({ type: "DELETE_ITEM", id });
  };

  collectorMachineInterface.openItem = id => {
    send({ type: "OPEN_ITEM", id });
  };

  collectorMachineInterface.closeItem = id => {
    send({ type: "CLOSE_ITEM", id });
  };

  collectorMachineInterface.focusItem = id => {
    send({ type: "FOCUS_ITEM", id });
  };

  collectorMachineInterface.setTODItem = id => {
    send({ type: "SET_TOD_ITEM", id });
  };

  const toggleCollectionSlot = (collectorMachineInterface.toggleCollectionSlot = value => {
    send({ type: "TOGGLE_COLLECTION_SLOT", value });
  });

  collectorMachineInterface.setInCurrentCollectionIDs = ids => {
    send({ type: "SET_IN_CURRENT_COLLECTION_IDS", ids });
  };

  collectorMachineInterface.addToCollection = id => {
    send({ type: "ADD_TO_COLLECTION", id });
    send({ type: "TOGGLE_COLLECTION_SLOT", value: false });
  };

  collectorMachineInterface.commitFilter = query => {
    send({ type: "COMMIT_FILTER", query });
  };

  collectorMachineInterface.showWorkbench = () => {
    send("SHOW_WORKBENCH");
  };

  collectorMachineInterface.showPlanner = () => {
    send("SHOW_PLANNER");
  };

  collectorMachineInterface.showExhibition = () => {
    send("SHOW_EXHIBITION");
  };

  collectorMachineInterface.expandQuest = key => {
    send({ type: "EXPAND_QUEST", key });
  };

  return (
    <div className={styles.collector}>
      <Layout
        onClick={() => {
          collectionSlotSelected && toggleCollectionSlot(false);
        }}
      >
        <Header
          className="header"
          style={{
            lineHeight: "initial",
            position: "fixed",
            zIndex: 1,
            width: "100%",
            height: 48
          }}
        >
          <span className={styles.logo}>The Collector</span>
          <div className={styles.menuWrapper}>
            <Menu
              theme="dark"
              mode="horizontal"
              selectedKeys={state.matches("workbench") ? ["1"] : ["2"]}
              style={{ lineHeight: "48px" }}
            >
              <Menu.Item key="1" onClick={() => send("SHOW_WORKBENCH")}>
                Workbench
              </Menu.Item>
              <Menu.Item key="2" onClick={() => send("SHOW_FRONTDESK")}>
                Frontdesk
              </Menu.Item>
            </Menu>
          </div>
        </Header>
        <Layout style={{ marginTop: 48, marginBottom: 32 }}>
          <Sider
            width={400}
            style={{
              background: "#fff",
              borderRight: "1px solid #ccc"
            }}
          >
            <Safe />
          </Sider>
          <Layout>
            {state.matches("workbench") && <Workbench />}
            {state.matches("frontdesk") && <Frontdesk />}
          </Layout>
        </Layout>
        <Footer
          style={{
            textAlign: "center",
            color: "#ffffffa6",
            backgroundColor: "#001529",
            position: "fixed",
            bottom: 0,
            zIndex: 1,
            width: "100%",
            height: "32px"
          }}
        >
          <span className={styles.footerContent}>
            The Collector ©2018 Created by Hcmetal with React, XState, Ant
            Design and <Icon type="heart" theme="filled" />
          </span>
        </Footer>
      </Layout>
    </div>
  );
};

export default Collector;
