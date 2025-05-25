import path from "path";
import { simpleGit } from "simple-git";

export async function getGitStatusMap(rootDir: string): Promise<Record<string, "modified" | "untracked" | "ignored">> {
  try {
    const git = simpleGit(rootDir);
    const status = await git.status();
    const ignored = await git.checkIgnore("*");

    const map: Record<string, "modified" | "untracked" | "ignored"> = {};
    status.modified.forEach((f) => map[path.resolve(rootDir, f)] = "modified");
    status.not_added.forEach((f) => map[path.resolve(rootDir, f)] = "untracked");
    (ignored || []).forEach((f) => map[path.resolve(rootDir, f)] = "ignored");

    return map;
  } catch (err: any) {
    if (err.message?.includes("not a git repository")) {
      console.warn("⚠️  Not a Git repository. Skipping Git status.");
      return {};
    }
    throw err;
  }
}

