import { formatSize } from "../helper/renderer";
import { FsMapEntry } from "../../types";

function renderHtml(entry: FsMapEntry): string {
  if (entry.isDirectory) {
    const childrenHtml = (entry.children || [])
      .map((child) => renderHtml(child))
      .join("");
    return `<li><strong>${entry.name}</strong><ul>${childrenHtml}</ul></li>`;
  } else {
    let details = entry.name;
    if (entry.size !== undefined) {
      details += ` (${formatSize(entry.size)})`;
    }
    if (entry.modifiedAt) {
      details += ` [${entry.modifiedAt.toISOString().split("T")[0]}]`;
    }
    return `<li>${details}</li>`;
  }
}

export { renderHtml }