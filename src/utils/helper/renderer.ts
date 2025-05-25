import { formatGitStatus } from "../lib/git/format-git-status";
import { FsMapEntry } from "../../types";

function renderTree(entry: FsMapEntry, prefix = "") {
  const connector = prefix === "" ? "" : prefix.slice(0, -4) + "└── ";
  let line = connector + entry.name;

  if (!entry.isDirectory) {
    if (entry.size !== undefined) {
      line += ` (${formatSize(entry.size)})`;
    }

    if (entry.modifiedAt) {
      const date = entry.modifiedAt.toISOString().split("T")[0];
      line += ` [${date}]`;
    }
    if (entry.gitStatus && entry.gitStatus !== "clean") {
      line += ` [${formatGitStatus(entry.gitStatus)}]`;
    }

  }

  console.log(line);

  if (entry.children && entry.children.length > 0) {
    const lastIndex = entry.children.length - 1;
    entry.children.forEach((child, i) => {
      const isLast = i === lastIndex;
      const newPrefix = prefix + (isLast ? "    " : "│   ");
      renderTree(child, newPrefix);
    });
  }
}

function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export { renderTree, formatSize }