import fs from "fs";
import path from "path";
import { FsMapEntry, FsMapOptions, FsMapStats, GitStatus } from "../../types";

function shouldIncludeEntry(name: string, options: FsMapOptions): boolean {
  const { include = [], exclude = [], showHidden = false } = options;

  if (!showHidden && name.startsWith(".")) return false;

  if (include.length > 0) {
    // Only include what is explicitly included
    return include.some((pattern) => name === pattern || name.startsWith(pattern));
  }

  if (exclude.length > 0) {
    // Include everything except excluded
    return !exclude.some((pattern) => name === pattern || name.startsWith(pattern));
  }

  return true; // fallback to including everything
}


async function buildFsTree(
  dir: string,
  options: FsMapOptions = {},
  gitStatusMap: Record<string, GitStatus> = {},
  currentDepth = 0,
  statsInfo: FsMapStats = { files: 0, folders: 0 },
  transform?: (entry: FsMapEntry) => FsMapEntry
): Promise<FsMapEntry | null> {
  const stats = fs.statSync(dir);
  const name = path.basename(dir);
  const resolvedPath = path.resolve(dir);

  if (!shouldIncludeEntry(name, options)) {
    return null;
  }

  let entry: FsMapEntry = {
    name,
    path: dir,
    isDirectory: stats.isDirectory(),
    size: options.showSize ? stats.size : undefined,
    modifiedAt: options.showDate ? stats.mtime : undefined,
    gitStatus: gitStatusMap[resolvedPath] || "clean"
  };

  if (stats.isDirectory() && currentDepth < (options.depth ?? Infinity)) {
    statsInfo.folders++;

    const childNames = fs.readdirSync(dir);
    const children: FsMapEntry[] = [];

    for (const child of childNames) {
      const childEntry = await buildFsTree(
        path.join(dir, child),
        options,
        gitStatusMap,
        currentDepth + 1,
        statsInfo,
        transform
      );
      if (childEntry) {
        children.push(childEntry);
      }
    }

    entry.children = children;

    if (options.showSize) {
      entry.size = children.reduce((sum, c) => sum + (c.size || 0), 0);
    }
  } else {
    statsInfo.files++;
  }

  return transform ? transform(entry) : entry;
}

export { buildFsTree };
