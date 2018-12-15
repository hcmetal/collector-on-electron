import { Machine, actions } from "xstate";
const { assign } = actions;

const questMachine = Machine({
  id: "quest",
  context: {
    titleInput: "",
    prevTitle: ""
  },
  type: "parallel",
  states: {
    titleEdit: {
      initial: "standby",
      on: {
        RESET_INPUT_TITLE: {
          actions: assign({ titleInput: (ctx, e) => e.value })
        }
      },
      states: {
        standby: {
          on: {
            FOCUS_INPUT_TITLE: {
              target: "input",
              actions: "focusTitleInput"
            }
          }
        },
        input: {
          onEntry: assign({ prevTitle: ctx => ctx.titleInput }),
          on: {
            CHANGE_INPUT_TITLE: {
              actions: assign({ titleInput: (ctx, e) => e.value })
            },
            CANCEL_INPUT_TITLE: {
              target: "standby",
              actions: assign({ titleInput: ctx => ctx.prevTitle })
            },
            COMMIT_INPUT_TITLE: {
              target: "standby",
              actions: assign({ prevTitle: ctx => ctx.titleInput })
            }
          }
        }
      }
    },
    slotEdit: {
      initial: "standby",
      states: {
        standby: {
          on: {
            CHOOSE_SLOT: "choose"
          }
        },
        choose: {
          on: {
            COMMIT_SLOT: "standby"
          }
        }
      }
    }
  }
});

export default questMachine;
