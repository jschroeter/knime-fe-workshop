import normalizeWhitespace from "./normalizeWhitespace";

export default (string = "") =>
  normalizeWhitespace(
    string
      // Remove HTML tags and unescape entities. Not perfect, but good enough.
      .replace(/<[^>]+>/g, " ")
      // resolve entities
      .replace(/&gt;/g, ">")
      .replace(/&lt;/g, "<")
      .replace(/&amp;/g, "&"),
  );
