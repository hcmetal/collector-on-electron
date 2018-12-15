import React, { useEffect } from "react";
import styles from "./Treasure.module.css";
import convertURL from "./../common/convertURL";
import useMachine from "../common/useMachine";
import treasureReadOnlyMachine from "./treasureReadOnlyMachine";
import { Modal } from "antd";

const TreasureReadOnly = ({ item, handleOpenItem, handleOpenWorkbench }) => {
  const [state, send] = useMachine(treasureReadOnlyMachine);

  const { pictureModalName } = state.context;

  useEffect(
    () => {
      send({ type: "SET_PICTURE_MODAL_NAME", value: "" });
    },
    [item]
  );

  let modalPicture;

  if (item.pictures.length > 0 && pictureModalName) {
    modalPicture = item.pictures.find(
      picture => picture.url === pictureModalName
    );
  }

  return (
    <>
      <h2
        className={styles.title}
        onClick={() => {
          handleOpenWorkbench();
          handleOpenItem(item.id);
        }}
      >
        {item.title}
      </h2>
      {item.pictures.length > 0 && (
        <div className={styles.pictureTiles}>
          {item.pictures.map((picture, index) => {
            return (
              <div
                key={`${picture.url}-${index}`}
                className={styles.pictureTile}
              >
                <img
                  className={styles.picture}
                  src={picture.url}
                  alt="a treasure"
                  onClick={() => {
                    send({
                      type: "SET_PICTURE_MODAL_NAME",
                      value: picture.url
                    });
                    send("OPEN_PICTURE_MODAL");
                  }}
                />
              </div>
            );
          })}
        </div>
      )}
      {modalPicture && (
        <Modal
          title={modalPicture.url}
          width={800}
          visible={state.matches("showPictureModal")}
          okButtonProps={{ style: { display: "none" } }}
          okText="Copy"
          cancelButtonProps={{ style: { display: "none" } }}
          onCancel={() => {
            send("CLOSE_PICTURE_MODAL");
          }}
        >
          <p className={styles.pictureInfo}>{modalPicture.info}</p>
          <img
            src={modalPicture.url}
            className={styles.pictureModalImage}
            alt="a treasue"
          />
        </Modal>
      )}
      {item.note && (
        <div className={styles.noteContainer}>
          <p className={styles.noteContent}>
            {item.note.split("\n").map((lineOfNote, key) => {
              return (
                <span
                  key={key}
                  dangerouslySetInnerHTML={convertURL(lineOfNote)}
                />
              );
            })}
          </p>
        </div>
      )}
    </>
  );
};

export default TreasureReadOnly;
