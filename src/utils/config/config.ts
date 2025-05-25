import fs from "fs";
import path from "path";
import { FsMapConfig } from "../../types";

const CONFIG_FILES = [
  "fsmap.config.json",
  ".fsmaprc",
];

export function loadFsMapConfig(): Partial<FsMapConfig> {
  for (const file of CONFIG_FILES) {
    const filePath = path.resolve(process.cwd(), file);
    if (fs.existsSync(filePath)) {
      try {
        const content = fs.readFileSync(filePath, "utf-8");
        return JSON.parse(content);
      } catch (e) {
        console.warn(`⚠️ Failed to parse config file: ${file}`);
      }
    }
  }

  return {};
}
