import { Machine, actions } from "xstate";
import uuid from "uuid-v4";

const { assign } = actions;

const createItem = type => {
  const d = new Date();

  if (type === "treasure") {
    return {
      id: uuid(),
      type: "treasure",
      title: "New Treasure",
      pictures: [],
      note: "Cool stuff",
      tags: [],
      discovered: false,
      timeCreate: `${d.getFullYear()}/${d.getMonth() + 1}/${d.getDate()}`,
      timeLastModify: `${d.getFullYear()}/${d.getMonth() + 1}/${d.getDate()}`
    };
  }

  if (type === "collection") {
    return {
      id: uuid(),
      type: "collection",
      title: "New Collection",
      treasureIDs: [],
      tags: [],
      isQuest: false,
      timeCreate: `${d.getFullYear()}/${d.getMonth() + 1}/${d.getDate()}`,
      timeLastModify: `${d.getFullYear()}/${d.getMonth() + 1}/${d.getDate()}`
    };
  }
};

export const collectorDefaultContext = {
  items: [],
  openedItemsIDs: [],
  focusedItemID: "",
  todItemID: "",
  collectionSlotSelected: false,
  addToCollectionItemID: "",
  inCurrentCollectionIDs: [],
  filterBy: "",
  frontdeskMode: "exhibition",
  expandedQuestKeys: []
};

const collectorMachine = Machine({
  id: "collector",
  context: collectorDefaultContext,
  initial: "frontdesk",
  on: {
    LOAD_CONTEXT: {
      actions: [
        assign({
          items: (ctx, e) => e.context.items
        }),
        assign({
          todItemID: (ctx, e) => e.context.todItemID
        })
      ]
    },
    CREATE_ITEM: {
      actions: [
        assign({
          items: (ctx, e) => [createItem(e.value)].concat(ctx.items)
        }),
        assign({
          openedItemsIDs: (ctx, e) => ctx.openedItemsIDs.concat(ctx.items[0].id)
        }),
        assign({
          focusedItemID: (ctx, e) => ctx.items[0].id
        }),
        "persist"
      ]
    },
    COMMIT_ITEM: {
      actions: [
        assign({
          items: (ctx, e) =>
            ctx.items.map(item => (item.id === e.item.id ? e.item : item))
        }),
        "persist"
      ]
    },
    DELETE_ITEM: {
      actions: [
        assign({
          items: (ctx, e) => ctx.items.filter(item => item.id !== e.id)
        }),
        assign({
          openedItemsIDs: (ctx, e) =>
            ctx.openedItemsIDs.filter(id => id !== e.id)
        }),
        assign({
          focusedItemID: (ctx, e) =>
            ctx.openedItemsIDs.length > 0 ? ctx.openedItemsIDs.slice(-1)[0] : ""
        }),
        assign({
          todItemID: (ctx, e) =>
            ctx.todItemID && ctx.todItemID === e.id ? "" : ctx.todItemID
        }),
        "persist"
      ]
    },
    OPEN_ITEM: {
      actions: [
        assign({
          openedItemsIDs: (ctx, e) =>
            ctx.openedItemsIDs.includes(e.id)
              ? ctx.openedItemsIDs
              : ctx.openedItemsIDs.concat(e.id)
        }),
        assign({
          focusedItemID: (ctx, e) => e.id
        })
      ]
    },
    CLOSE_ITEM: {
      actions: [
        assign({
          openedItemsIDs: (ctx, e) =>
            ctx.openedItemsIDs.filter(id => id !== e.id)
        }),
        assign({
          focusedItemID: (ctx, e) =>
            ctx.openedItemsIDs.length > 0 ? ctx.openedItemsIDs.slice(-1)[0] : ""
        })
      ]
    },
    FOCUS_ITEM: {
      actions: [
        assign({
          focusedItemID: (ctx, e) => e.id
        })
      ]
    },
    SET_TOD_ITEM: {
      actions: [
        assign({
          todItemID: (ctx, e) => e.id
        }),
        "persist"
      ]
    },
    TOGGLE_COLLECTION_SLOT: {
      actions: [
        assign({
          collectionSlotSelected: (ctx, e) => e.value
        })
      ]
    },
    SET_IN_CURRENT_COLLECTION_IDS: {
      actions: [
        assign({
          inCurrentCollectionIDs: (ctx, e) => e.ids
        })
      ]
    },
    ADD_TO_COLLECTION: {
      actions: [
        assign({
          addToCollectionItemID: (ctx, e) => e.id
        })
      ]
    },
    COMMIT_FILTER: {
      actions: [
        assign({
          filterBy: (ctx, e) => e.query
        })
      ]
    }
  },
  states: {
    frontdesk: {
      on: {
        SHOW_WORKBENCH: "workbench",
        SHOW_PLANNER: { actions: assign({ frontdeskMode: "planner" }) },
        SHOW_EXHIBITION: { actions: assign({ frontdeskMode: "exhibition" }) },
        EXPAND_QUEST: {
          actions: assign({
            expandedQuestKeys: (ctx, e) => e.key
          })
        }
      }
    },
    workbench: {
      on: {
        SHOW_FRONTDESK: "frontdesk"
      }
    }
  }
});

export default collectorMachine;
