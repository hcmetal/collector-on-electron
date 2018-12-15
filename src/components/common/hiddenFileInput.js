<input
  type="file"
  name="treasure_pic"
  accept=".jpg, .jpeg, .png, .gif, .webp"
  className={
    item.pictures.length > 0
      ? styles.pictureSelectorYay
      : styles.pictureSelectorNay
  }
  onChange={() => {
    newItem.pictures = newItem.pictures.concat({
      url: `./images/${pictureInputRef.current.files[0].name}`,
      info: "About this image"
    });
    handleCommitItem(newItem);
    // Clear value or onChange won't trigger if the same file is selected again next
    pictureInputRef.current.value = "";
  }}
  ref={pictureInputRef}
/>;
