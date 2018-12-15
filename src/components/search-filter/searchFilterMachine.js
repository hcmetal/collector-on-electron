import { Machine, actions } from "xstate";
const { assign } = actions;

const commit = {
  target: "searching",
  actions: "notifySearch",
  cond: ctx => ctx.searchFor.trim().length > 0
};

const searchFilterMachine = Machine({
  id: "search-filter",
  initial: "standby",
  context: {
    searchFor: "",
    prevSearch: ""
  },
  states: {
    standby: {
      on: {
        COMMIT: commit,
        INPUT: {
          target: "input"
        }
      }
    },
    input: {
      onEntry: assign({ prevSearch: ctx => ctx.searchFor }),
      on: {
        CHANGE: {
          actions: assign({ searchFor: (ctx, e) => e.value })
        },
        BLUR: "standby",
        COMMIT: commit,
        CANCEL_INPUT: {
          target: "input",
          actions: assign({ searchFor: ctx => ctx.prevSearch })
        }
      }
    },
    searching: {
      onEntry: "blurInput",
      on: {
        SEARCH_SUCCESS: "success",
        SEARCH_FAILURE: "error",
        CANCEL_SEARCH: {
          target: "input",
          actions: "cancelSearch"
        }
      }
    },
    error: {
      on: {
        "": "standby"
      }
    },
    success: {
      on: {
        CLEAR_FILTER: {
          target: "input",
          actions: ["focusInput", "notifyClearFilter"]
        }
      }
    }
  }
});

export default searchFilterMachine;
