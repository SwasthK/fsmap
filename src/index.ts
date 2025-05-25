#!/usr/bin/env node

import path from "path";
import fs from "fs";
import { buildFsTree } from "./utils/helper/reader";
import { loadFsMapConfig } from "./utils/config/config";
import { getGitStatusMap } from "./utils/lib/git/git-status-map";
import { FsMapEntry, FsMapStats } from "./types";
import { cloneRepoToTemp } from "./utils/lib/git/clone";
import pkg from "../package.json";
import { plugin, program, stats } from "./utils/constants/constants";
import { format } from "./utils/helper/format";
import { startSpinner, stopSpinner, failSpinner } from "./utils/lib/spinner/spinner";
import { sleep } from "./utils/helper/sleep";


program
    .name("fsmap")
    .description("🔍 Visualize the folder structure of any directory.\n\nNote: use -- before arguments when using npm run.\nExample: npm run start -- . -d 2")
    .version(pkg.version, "-v, --version", "Output the version number")
    .argument("[path]", "The directory to scan", ".")
    .option("-d, --depth <number>", "Limit recursion depth", parseInt)
    .option("-e, --exclude <names>", "Comma-separated list of files/folders to exclude (e.g. node_modules,.git)", (value) => value.split(","))
    .option("--show-size", "Display file sizes")
    .option("--show-date", "Display last modified dates")
    .option("--show-hidden", "Include hidden files and folders")
    .option("-o, --output-format <format>", "Choose output format: text (default), json, markdown, html")
    .option("--output-file <path>", "Write output to a file instead of console")
    .option("--show-git", "Display Git status for each file")
    .option("--dry-run", "Preview without writing output")
    .option("--repo <user/repo>", "Clone and scan a GitHub repo remotely")
    // .option(
    //     "-i, --include <names>",
    //     "Comma-separated list of files/folders to include exclusively (e.g. src,lib)",
    //     (value) => value.split(",")
    // )

    .action((inputPath, options) => {
        const run = async () => {

            let tree: FsMapEntry;
            let gitMap = {};

            const resolvedPath = path.resolve(inputPath);
            const defaultOptions = {
                exclude: ["node_modules", ".git", ".vscode", "dist", "build", "coverage", "tmp", "temp"],
                depth: 2,
                outputFormat: "text",
                showHidden: false,
            };

            const configFileOptions = loadFsMapConfig(); // from fsmap.config.json
            const cliOptions = options; // from Commander

            if (options.include && options.exclude) {
                console.error("You cannot use both --include and --exclude at the same time.");
                process.exit(1);
            }
            // if (options.include) {
            //     console.log("🔍 Using include mode. Only showing:", options.include);
            // } else if (options.exclude) {
            //     console.log("🔍 Using exclude mode. Skipping:", options.exclude);
            // }

            // if (configFileOptions.exclude && cliOptions.include) {
            //     console.warn("⚠️  Ignoring 'exclude' from config because 'include' flag is active.");
            // }

            const mergedOptions = {
                ...defaultOptions,
                ...configFileOptions,
                ...cliOptions,
            };

            if (mergedOptions.include?.length) {
                mergedOptions.exclude = [];
            }

            if (mergedOptions.exclude?.length) {
                mergedOptions.include = [];
            }

            try {
                // Handle remote repo
                if (mergedOptions.repo) {

                    startSpinner();
                    const tmpDir = await cloneRepoToTemp(mergedOptions.repo);
                    const result = await buildFsTree(tmpDir, mergedOptions, {}, 0, stats, plugin.transform);
                    if (result === null) {
                        failSpinner("❌ No valid file structure found.");
                        return;
                    }
                    tree = result;
                    await sleep(1000);
                    stopSpinner();

                    if (mergedOptions.dryRun) {
                        console.log();
                        console.log(`✅ Dry run complete. Found ${stats.files} files and ${stats.folders} folders.`);
                        return;
                    }

                    let outputText = format({ mergedOptions, tree, stats });
                    if (!outputText) {

                        return;
                    }

                    if (mergedOptions.outputFile) {
                        fs.writeFileSync(mergedOptions.outputFile, outputText, "utf-8");
                        console.log(`✅ Output written to ${path.resolve(mergedOptions.outputFile)}`);
                    } else {
                        console.log(outputText);
                    }

                    console.log(`\n📦 Scanned ${stats.files} files and ${stats.folders} folders.`);

                    return;
                }

                // Local directory scanning
                if (mergedOptions.showGit) {

                    gitMap = await getGitStatusMap(resolvedPath);
                }

                startSpinner();
                const result = await buildFsTree(resolvedPath, mergedOptions, gitMap, 0, stats, plugin.transform);
                if (result === null) {
                    failSpinner("❌ No valid file structure found.");
                    return;
                }
                tree = result;
                await sleep(1000)
                stopSpinner();

                if (mergedOptions.dryRun) {

                    return;
                }

                let outputText = format({ mergedOptions, tree, stats });
                if (!outputText) {

                    return;
                }



                if (mergedOptions.outputFile) {
                    fs.writeFileSync(mergedOptions.outputFile, outputText, "utf-8");
                    ;
                } else {


                    console.log(outputText);
                }
                console.log(`\n📦 Scanned ${stats.files} files and ${stats.folders} folders.`);
            } catch (error) {
                failSpinner("❌ An error occurred while scanning the directory.");
                console.error("\n", error instanceof Error ? error.message : error);
            }

        };

        run();
    });

program.parse();