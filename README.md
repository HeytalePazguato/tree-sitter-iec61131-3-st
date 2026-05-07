# project-blueprint

Generic scaffolding for a new repo. Click **Use this template** at the top of
the GitHub page to create a new project with all of this baked in.

## What's included

| Path | Purpose |
|---|---|
| `BLUEPRINT.md` | The conventions doc — branch flow, versioning, CI/CD, distribution, anti-patterns. **Read this first.** |
| `README.md` | This file. Replace it. |
| `CHANGELOG.md` | Keep a Changelog 1.1.0, empty `[Unreleased]` ready. |
| `VERSION` | Single-line semver, source of truth. Starts at `0.0.1`. |
| `CONTRIBUTING.md` | Quick start + branch flow + PR expectations. |
| `CODE_OF_CONDUCT.md` | Contributor Covenant 2.1. |
| `SECURITY.md` | Vulnerability reporting via private advisory. |
| `LICENSE` | MIT. Replace if needed. |
| `.gitattributes` | Line-ending normalization. Kills CRLF warnings on Windows. |
| `.gitignore` | Common build/IDE/secrets ignores. Add your language's. |
| `.github/FUNDING.yml` | GitHub Sponsors button. |
| `.github/dependabot.yml` | Weekly Actions bumps. Uncomment your language ecosystem. |
| `.github/PULL_REQUEST_TEMPLATE.md` | Summary / Changes / Test plan / Screenshots. |
| `.github/ISSUE_TEMPLATE/` | YAML issue forms (bug + feature) + config (Discussions for questions). |
| `.github/workflows/ci.yml` | Lint + build + test gate. |
| `.github/workflows/prerelease.yml` | Dev artifacts on `develop`; tagged prereleases on `release/*`. |
| `.github/workflows/release.yml` | Tag + publish on push to `main`. |
| `.github/workflows/pages.yml` | Optional Jekyll docs site from `/docs`. |
| `docs/` | Optional Pages source (cayman theme). |

## After clicking "Use this template"

1. Read `BLUEPRINT.md` end to end (it's not long).
2. **Delete `BLUEPRINT.md` from your new repo** — it's a setup reference,
   not a project file. The template's `.gitignore` already lists it so it
   won't sneak back in.
   ```sh
   git rm BLUEPRINT.md && git commit -m "chore: remove template reference"
   ```
3. Find every `TODO` comment in workflows and templates and resolve them.
4. Search-and-replace placeholders:
   - `{{PROJECT_NAME}}` → your project's name
   - `{{OWNER}}` → your GitHub handle/org
   - `{{DESCRIPTION}}` → one-sentence tagline
5. Configure repo metadata via `gh repo edit` (see BLUEPRINT.md §5).
6. Create the `develop` branch and push your first commit there. `main` stays
   untouched until your first release branch lands.

## License

MIT — see [LICENSE](LICENSE). Strip this line if you re-license the
generated project.
