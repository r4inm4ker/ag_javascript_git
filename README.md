# Git Workflow — Interactive Animated Tutorials

An interactive, browser-based tutorial suite for learning standard Git operations through step-by-step animated visualizations. Each tutorial page walks through a real-world Git workflow using a simulated Maya Python project (`mayatools`) as the working context.

## Purpose

This project is designed to teach Git concepts visually — no terminal required. Each tutorial page animates the state of local and remote repositories in real time, showing exactly what happens to commits, branches, and files as Git commands are applied.

## Tutorials

| # | Topic | File | Description |
|---|-------|------|-------------|
| 1 | **Git Clone** | `clone.html` | Retrieve a remote repository into a local workspace |
| 2 | **Git Add & Commit** | `edit_commit.html` | Edit files, stage changes, and record a commit |
| 3 | **Git Push** | `push.html` | Upload local branch commits to a remote |
| 4 | **Git Pull Fast-Forward** | `git_pull_main.html` | Sync a local repo with a clean, linear remote history |
| 5 | **Git Pull (Merge)** | `pull.html` | Pull from a diverged remote, creating a merge commit |
| 6 | **Merge Conflict** | `merge_conflict.html` | Simulate and resolve a conflict from competing edits |
| 7 | **Branch & Commits** | `branch.html` | Create branches and visualize isolated commit streams |
| 8 | **Git Push Branch** | `push_branch.html` | Set up remote tracking and push a feature branch |
| 9 | **Merge Request** | `merge_request.html` | Walk through code review and merging a Merge Request |
| 10 | **Git Checkout & Pull** | `checkout_main_pull_origin_main.html` | Switch to main and sync the merged remote changes |
| 11 | **Git Reset --hard** | `reset.html` | Drop a broken commit and hard-reset to a clean state |
| 12 | **Git Reset --soft** | `reset_soft.html` | Roll back a commit while keeping changes staged |
| 13 | **Git Squash** | `squash.html` | Combine multiple WIP commits into one clean commit |
| 14 | **Git Cherry-Pick** | `cherry_pick.html` | Apply a single commit from one branch onto another |
| 15 | **Git Merge** | `merge_in_branch.html` | Merge divergent branch histories with a merge commit |
| 16 | **Git Rebase** | `rebase.html` | Rewrite history by rebasing onto the tip of another branch |
| 17 | **Git Stash** | `stash.html` | Temporarily shelve unfinished changes and restore them later |
| 18 | **Git Blame** | `blame.html` | Trace which commit last modified each line of a file |

## Project Structure

```
ag_javascript_git/
├── index.html                  # Tutorial directory / home page
├── style.css                   # Shared design system and component styles
├── sidebar.js                  # Collapsible sidebar navigation (shared across all pages)
├── <tutorial>.html             # One HTML file per tutorial
├── <tutorial>.js               # Matching JS logic and animation controller per tutorial
└── README.md
```

## Tech Stack

- **HTML / CSS / Vanilla JavaScript** — No frameworks or build tools required
- **Google Fonts** (Inter) — Typography
- **Fira Code** — Monospace font for code editor panels

## Running Locally

Open `index.html` directly in any modern browser. No server required — all pages are standalone static files.

```bash
# Optional: serve with any static file server
npx serve .
```

## Design

- Dark-mode UI with glassmorphism panels
- Color-coded per tutorial type (branches, commits, remote vs local)
- Step-by-step progression with animated repository state changes
- Simulated code editor panels showing Python source changes where relevant
