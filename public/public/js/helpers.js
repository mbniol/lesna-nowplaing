Document.prototype.createElementFromString = function (str) {
  const element = new DOMParser().parseFromString(str, "text/html");
  const child = element.documentElement.querySelector("body").firstChild;
  return child;
};
