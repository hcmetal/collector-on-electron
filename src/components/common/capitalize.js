export const capitalize = string => {
  if (string && typeof string === "string") {
    return string.slice(0, 1).toUpperCase() + string.slice(1).toLowerCase();
  } else {
    console.log(`invalid string input, type of ${typeof string}`);
  }
};
