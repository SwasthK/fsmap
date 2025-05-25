import { GitStatus } from "../../../types";

function formatGitStatus(status: GitStatus): string {
  switch (status) {
    case "modified": return "🟡 modified";
    case "untracked": return "🟢 untracked";
    case "ignored": return "🔵 ignored";
    default: return "";
  }
}

export { formatGitStatus }
