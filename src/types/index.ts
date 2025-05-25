interface FsMapEntry {
  name: string;
  path: string;
  isDirectory: boolean;
  children?: FsMapEntry[];
  size?: number;
  modifiedAt?: Date;
  gitStatus?: GitStatus;
  currentDepth?: number;
}

interface FsMapOptions {
  depth?: number;
  exclude?: string[];
  include?: string[];
  showSize?: boolean;
  showDate?: boolean;
  showHidden?: boolean;
  outputFormat?: "text" | "json" | "markdown" | "html";
}

type FsMapConfig = FsMapOptions & {
  outputFormat?: "text" | "json" | "markdown";
  outputFile?: string;
};

interface FsMapStats {
  files: number;
  folders: number;
}

interface FsMapPlugin {
  transform?: (entry: FsMapEntry) => FsMapEntry | null;
}

type GitStatus = "modified" | "untracked" | "ignored" | "clean";

export {
  FsMapEntry,
  FsMapOptions,
  FsMapConfig,
  GitStatus,
  FsMapStats,
  FsMapPlugin
}
