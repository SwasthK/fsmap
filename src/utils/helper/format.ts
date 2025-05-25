import { exportAsJSON, exportAsMarkdown } from "../export/exporter";
// import { spinner } from "../lib/ora/ora";
import { renderTree } from "./renderer";

function format({ mergedOptions, tree, stats }: {
    mergedOptions: any,
    tree: any,
    stats: any
}): string {
    let outputText: string;
    switch (mergedOptions.outputFormat) {
        case "json":
            console.log("\n")
            outputText = exportAsJSON(tree);
            break;
        case "markdown":
            console.log("\n")
            outputText = exportAsMarkdown(tree);
            break;
        case "text":
        default:
            console.log("\n")
            renderTree(tree);
            console.log(`\n📦 Scanned ${stats.files} files and ${stats.folders} folders.`);
            return "";
    }
    return outputText;
}

export { format };