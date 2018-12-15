import { Machine, actions } from "xstate";
const { assign } = actions;

const collectionMachine = Machine({
  id: "collection",
  context: {
    titleInput: "",
    prevTitle: "",
    slotIndex: ""
  },
  on: {
    CHOOSE_SLOT: {
      actions: [assign({ slotIndex: (ctx, e) => e.value })]
    }
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
    }
    // slotEdit: {
    //   initial: "standby",
    //   states: {
    //     standby: {
    //     },
    //     choose: {
    //       on: {
    //         COMMIT_SLOT: "standby"
    //       },
    //       on: {
    //         BLUR_SLOT: {
    //           target: "standby",
    //           actions: [assign({ slotIndex: "" })]
    //         }
    //       }
    //     }
    //   }
    // }
  }
});

export default collectionMachine;
