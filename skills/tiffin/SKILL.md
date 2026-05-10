---
name: tiffin
description: Command-line meal idea and meal planning tool. Use when the user needs to add, list, or show meal items, courses (e.g., breakfast), and occasions (e.g., camping).
---

# Tiffin Skill

Tiffin is a tool for managing a database of meal items, categorized by courses and occasions. It is designed for both human use and AI agent automation.

## Agent Essentials

- **JSON Mode**: Always pass `--json` for structured, machine-readable output.
- **Database Path**: Use `--db <path>` to operate against a specific database file. Default is `~/.tiffin/tiffin.db`.
- **Exit Codes**:
  - `0`: Success.
  - `1`: General error.
  - `2`: No match found.
- **Duplicate Add**: Adding an item that already exists exits with `0` but includes `"created": false` in the JSON output.

## Command Reference

| Command | Description |
|---------|-------------|
| `tiffin add <name> [courses...] [--for occasions...]` | Add a new meal item with optional courses and occasions. |
| `tiffin list [course] [--for occasion]` | List items, optionally filtered by course or occasion. |
| `tiffin list occasions` | List all unique occasions present in the database. |
| `tiffin list courses` | List all unique courses present in the database. |
| `tiffin show <name>` | Show full details for a specific item, including all associated tags. |

## Common Agent Patterns

### Adding a new meal with tags
```bash
tiffin --json add "Banana Waffles" breakfast --for "camping" "school day"
```

### Checking if an item exists before adding
```bash
tiffin --json show "Dosa"
# If exit code is 2, item doesn't exist.
```

### Listing items for a specific context
```bash
tiffin --json list breakfast --for "indian festival"
```

### Listing available tags
```bash
tiffin --json list courses
tiffin --json list occasions
```

## Data Model

- **Item**: A meal or drink (e.g., "Dosa").
- **Course**: When it's served (e.g., breakfast, lunch).
- **Occasion**: The context (e.g., camping, thanksgiving).

All tags (courses and occasions) are case-insensitive and stored in lowercase.
