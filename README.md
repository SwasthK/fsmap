# 🗂️ fsmap — Visualize Folder Structures from Local or GitHub Repos

**fsmap** is a powerful CLI tool that scans any directory (local or remote GitHub repo) and visualizes its folder structure in a clean, tree-like format.

Supports output as text, markdown, JSON, and even integrates file size, modified dates, and Git status.

---

## 📦 Features

- 📁 Visualize any local folder structure
- 🌍 Fetch and display **GitHub repo structure** via `--repo`
- 🧹 Smart one-repo caching system (reuse if same repo, delete if not)
- 💾 Show file sizes (`--show-size`)
- 🕒 Show last modified dates (`--show-date`)
- 🧑‍💻 Show Git status (`--show-git`)
- 📝 Output as: text (default), markdown, JSON, or HTML
- 📄 Save output to a file
- 🔍 Works recursively with depth control

---

## 🛠️ Installation

```bash
npm install -g fsmap
```

---

## 🚀 Usage

```bash
fsmap [path] [options]
```

By default, it scans the **current directory (`.`)**.

---

### 📁 Scan a local folder

```bash
fsmap . --depth 2 --show-size --show-date
```

### 🌐 Scan a remote GitHub repo

```bash
fsmap --repo user/repo
```

### 💾 Export as markdown

```bash
fsmap . -o markdown > structure.md
```

### 📝 Save output to a file

```bash
fsmap . --output-format json --output-file structure.json
```

---

## 📑 Example Output (Text)

```bash
fsmap . --depth 1 --show-size --show-date
```

```
fsmap
└── dist (4.2 KB) [2025-05-23]
└── package.json (894 B) [2025-05-23]
└── src (7 files)
```

---

## 🔧 Available Options

| Option                     | Description                                               |
|---------------------------|-----------------------------------------------------------|
| `-d, --depth <n>`         | Limit recursion depth                                     |
| `-e, --exclude <names>`   | Comma-separated list of folders/files to exclude          |
| `--show-size`             | Display file sizes                                        |
| `--show-date`             | Display last modified date                                |
| `--show-hidden`           | Include hidden files and folders                          |
| `--show-git`              | Display Git status (`modified`, `untracked`, `ignored`)   |
| `-o, --output-format`     | Output format: `text` (default), `markdown`, `json`       |
| `--output-file <path>`    | Save the output to a file instead of printing to console  |
| `--repo <user/repo>`      | Clone and scan a GitHub repository                        |
| `--dry-run`               | Show scan result without writing anything                 |
| `-v, --version`           | Show version info                                         |
| `-h, --help`              | Show help info                                            |

---

## 🧠 Repo Caching Behavior

- ✅ If you scan the same repo again → uses cached clone
- 🔁 If you scan a different repo → deletes old repo, clones fresh
- 💡 Only **one repo** is ever cached at a time for performance and clarity

---

## 🛠 Plugin Support

Add a `fsmap.config.js` file in your project root to transform or extend the file tree output.

Example:

```js
module.exports = {
  transform(entry) {
    if (entry.type === "file" && entry.name.endsWith(".test.js")) {
      entry.meta = { test: true };
    }
    return entry;
  }
};
```

---

## 🤝 Contributing

Found a bug? Have a feature idea? PRs are welcome — open an issue first!

---

## 📄 License

[MIT](./LICENSE)

---

## ✨ Author

Made with ❤️ by [Swasthik](https://github.com/SwasthK)