import path from "path";
import fs from "fs";
import os from "os";
import { simpleGit } from "simple-git";

const git = simpleGit();

function cleanAllRepos(baseDir: string) {
  if (fs.existsSync(baseDir)) {
    fs.rmSync(baseDir, { recursive: true, force: true });
    console.log(` Cleared previous cached repo from: ${baseDir}`);
  }
}

export async function cloneRepoToTemp(userRepo: string): Promise<string> {
  const [user, repo] = userRepo.split("/");
  const baseDir = path.join(os.tmpdir(), ".fsmap");
  const repoDir = path.join(baseDir, `${user}-${repo}`);

  // 🧠 If a different repo exists → clean and start over
  const otherReposExist =
    fs.existsSync(baseDir) &&
    fs.readdirSync(baseDir).some((entry) => entry !== `${user}-${repo}`);

  if (otherReposExist) {
    cleanAllRepos(baseDir);
  }

  // ✅ If same repo exists, reuse it
  if (fs.existsSync(repoDir)) {
    console.log(` Reusing cached repo: ${repoDir}`);
    return repoDir;
  }

  // ⬇️ Clone new repo
  console.log(` Cloning fresh repo: https://github.com/${user}/${repo}`);
  fs.mkdirSync(baseDir, { recursive: true });
  await git.clone(`https://github.com/${user}/${repo}.git`, repoDir, ["--depth", "1"]);
  console.log(` Repo cloned to: ${repoDir}`);

  return repoDir;
}
