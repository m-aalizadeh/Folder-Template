export const findNode = (data, pathArray, index = 0) => {
  if (index === pathArray.length - 1) return data;

  const current = pathArray[index];
  if (data.name === current && data.children) {
    for (const child of data.children) {
      if (child.name === pathArray[index + 1]) {
        return findNode(child, pathArray, index + 1);
      }
    }
  }
  return null;
};

export const sortChildren = (children) => {
  return [...children].sort((a, b) => {
    if (a.type === b.type) return a.name.localeCompare(b.name);
    return a.type === "folder" ? -1 : 1;
  });
};
