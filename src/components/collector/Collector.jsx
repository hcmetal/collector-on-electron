import React from "react";
import Safe from "../safe/Safe";
import styles from "./Collector.module.css";
import { Layout, Menu, Icon } from "antd";
import useMachine from "./../common/useMachine";
import collectorMachine, { collectorDefaultContext } from "./collectorMachine";
import Workbench from "../workbench/Workbench";
import Frontdesk from "../frontdesk/Frontdesk";

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

  const {
    items,
    openedItemsIDs,
    focusedItemID,
    todItemID,
    collectionSlotSelected,
    addToCollectionItemID,
    inCurrentCollectionIDs,
    filterBy
  } = state.context;

  const createItem = type => {
    send({ type: "CREATE_ITEM", value: type });
  };

  const commitItem = item => {
    const d = new Date();
    item.timeLastModify = `${d.getFullYear()}/${d.getMonth() +
      1}/${d.getDate()}`;
    send({ type: "COMMIT_ITEM", item });
  };

  const deleteItem = id => {
    send({ type: "DELETE_ITEM", id });
  };

  const openItem = id => {
    send({ type: "OPEN_ITEM", id });
  };

  const closeItem = id => {
    send({ type: "CLOSE_ITEM", id });
  };

  const focusItem = id => {
    send({ type: "FOCUS_ITEM", id });
  };

  const setTODItem = id => {
    send({ type: "SET_TOD_ITEM", id });
  };

  const toggleCollectionSlot = value => {
    send({ type: "TOGGLE_COLLECTION_SLOT", value });
  };

  const setInCurrentCollectionIDs = ids => {
    send({ type: "SET_IN_CURRENT_COLLECTION_IDS", ids });
  };

  const addToCollection = id => {
    send({ type: "ADD_TO_COLLECTION", id });
    send({ type: "TOGGLE_COLLECTION_SLOT", value: false });
  };

  const commitFilter = query => {
    send({ type: "COMMIT_FILTER", query });
  };

  const showWorkbench = () => {
    send("SHOW_WORKBENCH");
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
            <Safe
              items={items}
              openedItemsIDs={openedItemsIDs}
              focusedItemID={focusedItemID}
              todItemID={todItemID}
              onCreateItem={createItem}
              onOpenItem={openItem}
              collectionSlotSelected={collectionSlotSelected}
              onAddToCollection={addToCollection}
              inCurrentCollectionIDs={inCurrentCollectionIDs}
              filterBy={filterBy}
              onCommitFilter={commitFilter}
              onShowWorkbench={showWorkbench}
            />
          </Sider>
          <Layout>
            {state.matches("workbench") && (
              <Workbench
                items={items}
                openedItemsIDs={openedItemsIDs}
                focusedItemID={focusedItemID}
                todItemID={todItemID}
                onOpenItem={openItem}
                handleCloseItem={closeItem}
                handleFocusItem={focusItem}
                onCommitItem={commitItem}
                onDeleteItem={deleteItem}
                onSetTODItem={setTODItem}
                onToggleCollectionSlot={toggleCollectionSlot}
                addToCollectionItemID={addToCollectionItemID}
                onAddToCollection={addToCollection}
                onSetInCurrentCollectionIDs={setInCurrentCollectionIDs}
              />
            )}
            {state.matches("frontdesk") && (
              <Frontdesk
                items={items}
                todItemID={todItemID}
                onOpenItem={openItem}
                onShowWorkbench={showWorkbench}
              />
            )}
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
