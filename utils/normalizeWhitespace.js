// normalize whitespace like a browser does within text nodes
export default (string = "") => string.replace(/[\s]+/g, " ").trim();
