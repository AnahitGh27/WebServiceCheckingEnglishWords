function normalizeWord(word) {
  const lowerCaseStr = word.replace(/[^A-Za-z]/g, "").toLowerCase();
  const irregularWords = {
    men: "man",
    women: "woman",
    children: "child",
    teeth: "tooth",
    feet: "foot",
  };

  if (lowerCaseStr in irregularWords) {
    return irregularWords[lowerCaseStr];
  }

  if (lowerCaseStr.endsWith("ies")) {
    return lowerCaseStr.slice(0, -3) + "y";
  } else if (lowerCaseStr.endsWith("es")) {
    return lowerCaseStr.slice(0, -2);
  } else if (lowerCaseStr.endsWith("s")) {
    return lowerCaseStr.slice(0, -1);
  }
  return lowerCaseStr;
}

module.exports = { normalizeWord };
