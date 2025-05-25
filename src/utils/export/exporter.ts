
import { formatSize } from "../helper/renderer";
import { FsMapEntry } from "../../types";

export function exportAsJSON(tree: FsMapEntry): string {
  console.log("Exporting as JSON");
  return JSON.stringify(tree, null, 2);
}

export function exportAsMarkdown(tree: FsMapEntry, depth = 0): string {
  if (!tree) return ""; // <-- protect against null accidentally passed in

  const indent = "  ".repeat(depth);
  const sizeStr = tree.size ? ` (${formatSize(tree.size)})` : "";
  const dateStr = tree.modifiedAt ? ` [${tree.modifiedAt.toISOString().split("T")[0]}]` : "";
  let line = `${indent}- ${tree.name}${sizeStr}${dateStr}`;

  const children = tree.children?.filter(Boolean).map(child =>
    exportAsMarkdown(child, depth + 1)
  );

  return [line, ...(children || [])].join("\n");
}
