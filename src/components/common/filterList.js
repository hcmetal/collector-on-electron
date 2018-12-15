// function filterListRegex(q, list) {
//   if (q) {
//     function escapeRegExp(s) {
//       return s.replace(/[-/\\^$*+?.()|[\]{}]/g, "\\$&");
//     }

//     const words = q
//       .split(/\s+/g)
//       .map(s => s.trim())
//       .filter(s => !!s);

//     const hasTrailingSpace = q.endsWith(" ");

//     const searchRegex = new RegExp(
//       words
//         .map((word, i) => {
//           if (i + 1 === words.length && !hasTrailingSpace) {
//             // The last word - ok with the word being "startswith"-like
//             return `(?=.*\\b${escapeRegExp(word)})`;
//           } else {
//             // Not the last word - expect the whole word exactly
//             return `(?=.*\\b${escapeRegExp(word)}\\b)`;
//           }
//         })
//         .join("") + ".+",
//       "gi"
//     );

//     return list.filter(item => {
//       return searchRegex.test(item.title);
//     });
//   } else {
//     return list;
//   }
// }

export function filterList(query, list) {
  if (query.trim()) {
    const wordsInQuery = query
      .split(/\s+/g)
      .map(s => s.trim().toLowerCase())
      .filter(s => !!s);

    function matchWords(title) {
      const wordsInTitle = title
        .split(/\s+/g)
        .map(s => s.trim().toLowerCase())
        .filter(s => !!s);

      let match = true;

      for (let queryWord of wordsInQuery) {
        let includes = false;

        for (let titleWord of wordsInTitle) {
          includes = includes || titleWord.includes(queryWord);
        }

        match = match && includes;
      }

      return match;
    }

    return list.filter(item => {
      return matchWords(item.title);
    });
  } else {
    return list;
  }
}
