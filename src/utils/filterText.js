import * as filipinoBarwords from "filipino-badwords-list";
import { Filter } from "bad-words";
import { getUser } from "./helpers";

export const filterText = (text) => {
  try {
    const filter = new Filter({ list: filipinoBarwords.array });
    if (typeof text === "string" && getUser()?.role !== "admin") {
      return replaceLinks(filter.clean(text));
    } else {
      return replaceLinks(text);
    }
  } catch (error) {
    console.error("Error filtering text:", error);
    return replaceLinks(text);
  }
};

function replaceLinks(text) {
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  return text?.replace(urlRegex, function (url) {
    return `<a href="${url}" target="_blank" rel="noopener noreferrer">${url}</a>`;
  });
}