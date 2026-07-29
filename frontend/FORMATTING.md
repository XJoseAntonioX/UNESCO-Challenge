# Formatting rules

This project uses [Prettier](https://prettier.io/) to keep source formatting consistent. The active configuration is in [`.prettierrc.json`](./.prettierrc.json).

## Declared rules

| Rule                        | Value       | Purpose                                                                     |
| --------------------------- | ----------- | --------------------------------------------------------------------------- |
| `arrowParens`               | `always`    | Keeps arrow function parameters consistent, including single parameters.    |
| `bracketSameLine`           | `false`     | Places a multiline JSX closing bracket on its own line for easier scanning. |
| `bracketSpacing`            | `true`      | Uses spaces inside object destructuring and object literals.                |
| `endOfLine`                 | `lf`        | Uses Unix line endings consistently across operating systems.               |
| `htmlWhitespaceSensitivity` | `css`       | Preserves JSX/HTML whitespace according to normal CSS behavior.             |
| `jsxSingleQuote`            | `false`     | Keeps JSX attributes in the usual double-quote style.                       |
| `printWidth`                | `100`       | Wraps lines at a readable width without forcing excessive wrapping.         |
| `proseWrap`                 | `preserve`  | Does not unexpectedly reflow Markdown prose.                                |
| `quoteProps`                | `as-needed` | Quotes object properties only when JavaScript syntax requires it.           |
| `semi`                      | `false`     | Uses the project’s semicolon-free JavaScript/TypeScript style.              |
| `singleAttributePerLine`    | `false`     | Allows short JSX elements to keep multiple attributes on one line.          |
| `singleQuote`               | `true`      | Uses single quotes in JavaScript and TypeScript strings.                    |
| `tabWidth`                  | `2`         | Uses two spaces for each indentation level.                                 |
| `trailingComma`             | `all`       | Adds trailing commas wherever supported, making diffs smaller.              |
| `useTabs`                   | `false`     | Uses spaces rather than tab characters for indentation.                     |

## Commands

From the `frontend` directory:

```bash
npm run format       # format supported source files
npm run format:check # check formatting without changing files
```

To change a preference, edit `.prettierrc.json`, then run `npm run format:check` to review the impact before committing.

Prettier formats code; ESLint remains responsible for code-quality and correctness rules.
