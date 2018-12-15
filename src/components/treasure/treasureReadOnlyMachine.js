import { Machine, actions } from "xstate";
const { assign } = actions;

const treasureReadOnlyMachine = Machine({
  id: "treasure-read-only",
  context: {
    pictureModalName: ""
  },
  initial: "hidePictureModal",
  on: {
    SET_PICTURE_MODAL_NAME: {
      actions: assign({ pictureModalName: (ctx, e) => e.value })
    }
  },
  states: {
    hidePictureModal: {
      on: {
        OPEN_PICTURE_MODAL: "showPictureModal"
      }
    },
    showPictureModal: {
      on: {
        CLOSE_PICTURE_MODAL: "hidePictureModal"
      }
    }
  }
});

export default treasureReadOnlyMachine;
