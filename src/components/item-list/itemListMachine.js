import { Machine, actions } from "xstate";
const { assign } = actions;

const itemListMachine = Machine({
  id: "item-list",
  initial: "all",
  states: {
    all: {
      on: {
        FILTER: "filtered"
      }
    },
    filtered: {
      on: {
        CLEAR_FILTER: "all"
      }
    }
  }
});

export default itemListMachine;
