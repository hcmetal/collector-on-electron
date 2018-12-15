import { Machine, actions } from "xstate";

const frontdeskMachine = Machine({
  id: "frontdesk",
  initial: "exhibition",
  states: {
    exhibition: {
      on: {
        SHOW_PLANNER: "planner"
      }
    },
    planner: {
      on: {
        SHOW_EXHIBITION: "exhibition"
      }
    }
  }
});

export default frontdeskMachine;
