# Shams Dev Bridge

Safe executor for future autonomous Shams development.

- Repository: `joblack2-ui/web-page`
- Writable branch: `shams-dev`
- `main` is never writable.
- Protected Shams/auth files are rejected.
- GitHub credentials are never stored in the repository.
- Every successful write becomes a Git commit.

Required Edge Function secrets:

- `GITHUB_TOKEN`
- `SHAMS_DEV_BRIDGE_KEY`

Intended flow:

Shams runtime -> decision/review layer -> Dev Bridge -> shams-dev commit -> verification -> PR/review -> main.

The bridge is an executor, not permission to bypass review or protected zones.
