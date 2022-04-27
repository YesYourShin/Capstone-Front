export const copyObj = (obj) => {
  const result = {};
  for (let key in obj) {
    if (typeof obj[key] === 'object') {
      result[key] = copyObj(obj[key]);
    } else {
      result[key] = obj[key];
    }
  }
  return result;
}
