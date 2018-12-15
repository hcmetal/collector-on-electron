import { Machine, actions } from "xstate";
const { assign } = actions;

const tagGroupMachine = Machine({
  id: "tag-group",
  context: {
    inputValue: "",
    prevInput: ""
  },
  initial: "standby",
  on: {
    RESET_INPUT: {
      actions: assign({ inputValue: (ctx, e) => e.value })
    }
  },
  states: {
    standby: {
      on: {
        FOCUS_INPUT: {
          target: "input",
          actions: "focusInput"
        }
      }
    },
    input: {
      onEntry: assign({ prevInput: ctx => ctx.inputValue }),
      on: {
        CHANGE_INPUT: {
          actions: assign({ inputValue: (ctx, e) => e.value })
        },
        CANCEL_INPUT: {
          target: "standby",
          actions: assign({ inputValue: ctx => ctx.prevInput })
        },
        COMMIT_INPUT: {
          target: "standby",
          actions: assign({ prevInput: ctx => ctx.inputValue })
        }
      }
    }
  }
});

export default tagGroupMachine;
