import { Machine, actions } from "xstate";
const { assign } = actions;

const treasureMachine = Machine({
  id: "treasure",
  context: {
    titleInput: "",
    prevTitle: "",
    noteInput: "",
    prevNote: "",
    pictureModalName: "",
    pictureInfoInput: "",
    prevPictureInfo: ""
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
    noteEdit: {
      initial: "standby",
      on: {
        RESET_INPUT_NOTE: {
          actions: assign({ noteInput: (ctx, e) => e.value })
        }
      },
      states: {
        standby: {
          on: {
            FOCUS_INPUT_NOTE: {
              target: "input",
              actions: "focusNoteInput"
            }
          }
        },
        input: {
          onEntry: assign({ prevNote: ctx => ctx.noteInput }),
          on: {
            CHANGE_INPUT_NOTE: {
              actions: assign({ noteInput: (ctx, e) => e.value })
            },
            CANCEL_INPUT_NOTE: {
              target: "standby",
              actions: assign({ noteInput: ctx => ctx.prevNote })
            },
            COMMIT_INPUT_NOTE: {
              target: "standby",
              actions: assign({ prevNote: ctx => ctx.noteInput })
            }
          }
        }
      }
    },
    pictureDisplay: {
      initial: "hide",
      states: {
        hide: {
          on: {
            SHOW_PICTURE: "show"
          }
        },
        show: {
          on: {
            HIDE_PICTURE: "hide"
          }
        }
      }
    },
    pictureModal: {
      initial: "hide",
      on: {
        SET_PICTURE_MODAL_NAME: {
          actions: assign({ pictureModalName: (ctx, e) => e.value })
        }
      },
      states: {
        hide: {
          on: {
            OPEN_PICTURE_MODAL: "show"
          }
        },
        show: {
          on: {
            CLOSE_PICTURE_MODAL: "hide"
          }
        }
      }
    },
    pictureInfoEdit: {
      initial: "standby",
      on: {
        SET_INPUT_PICTURE_INFO: {
          actions: assign({ pictureInfoInput: (ctx, e) => e.value })
        }
      },
      states: {
        standby: {
          on: {
            FOCUS_INPUT_PICTURE_INFO: {
              target: "input",
              actions: "focusPictureInfoInput"
            }
          }
        },
        input: {
          onEntry: assign({ prevPictureInfo: ctx => ctx.pictureInfoInput }),
          on: {
            CHANGE_INPUT_PICTURE_INFO: {
              actions: assign({ pictureInfoInput: (ctx, e) => e.value })
            },
            CANCEL_INPUT_PICTURE_INFO: {
              target: "standby",
              actions: assign({ pictureInfoInput: ctx => ctx.prevPictureInfo })
            },
            COMMIT_INPUT_PICTURE_INFO: {
              target: "standby",
              actions: assign({ prevPictureInfo: ctx => ctx.pictureInfoInput })
            }
          }
        }
      }
    }
  }
});

export default treasureMachine;
