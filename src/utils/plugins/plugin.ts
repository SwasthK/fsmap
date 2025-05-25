import fs from "fs";
import path from "path";

export function loadPlugin(): Partial<{
  transform: (entry: any) => any;
}> {
  const configPaths = [
    path.resolve("fsmap.config.js"),
    path.resolve("dist/fsmap.config.js") // use built JS version if exists
  ];

  for (const configPath of configPaths) {
    if (fs.existsSync(configPath)) {
      try {
        const plugin = require(configPath);
        return plugin;
      } catch (err) {
        console.warn("❌ Failed to load plugin:", configPath);
        console.error(err);
        return {};
      }
    }
  }

  return {};
}
