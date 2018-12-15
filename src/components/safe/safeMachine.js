import { Machine, actions } from "xstate";
const { assign } = actions;

const safeMachine = Machine({
  id: "safe",
  initial: "standby",
  states: {
    standby: {
      on: {
        FREEZE: "freeze"
      }
    },
    freeze: {
      on: {
        UNFREEZE: "standby"
      }
    }
  }
});

export default safeMachine;
