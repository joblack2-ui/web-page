# Shams Autonomous Developer

Server-side development runner for Athar. It reads limited context from `shams-dev`, asks a coding model for one file change, validates it, then sends it to `shams-dev-bridge` for the protected GitHub write.

Safety: `main` is never writable; protected Shams/auth paths are rejected; one file per run; no deletion; secrets stay server-side; unsupported real-world claims must be labeled. This source is not deployed automatically.