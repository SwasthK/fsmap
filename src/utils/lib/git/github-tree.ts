
import { FsMapEntry } from "../../../types";

export async function fetchGitHubTree(userRepo: string, path = ""): Promise<any> {
  const [owner, repo] = userRepo.split("/");
  const url = `https://api.github.com/repos/${owner}/${repo}/contents/${path}`;

  const res = await fetch(url, {
    headers: { "User-Agent": "fsmap-cli" }
  });

  if (!res.ok) throw new Error(`Failed to fetch ${url} (${res.status})`);

  const data = await res.json();

  const entry: FsMapEntry = {
    name: path || repo,
    path: `/${path}`,
    isDirectory: true,
    children: [],
  };

  for (const item of data) {
    if (item.type === "dir") {
      const child = await fetchGitHubTree(userRepo, item.path);
      entry.children!.push(child);
    } else {
      entry.children!.push({
        name: item.name,
        path: `/${item.path}`,
        isDirectory: false,
      });
    }
  }

  return entry;
}
