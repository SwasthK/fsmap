import { Command } from "commander";
import { loadPlugin } from "../plugins/plugin";
import { FsMapStats } from "../../types";

const program = new Command();
const plugin = loadPlugin();
const stats: FsMapStats = { files: 0, folders: 0 };

export {
    program,
    plugin,
    stats,
}