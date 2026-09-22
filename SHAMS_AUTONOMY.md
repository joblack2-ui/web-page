# SHAMS AUTONOMY — EXECUTION LAYER

1. Shams observes the Athar project and proposes a change.
2. A decision/review layer checks it against the development constitution.
3. The Dev Bridge is the only write executor.
4. The Dev Bridge writes only to `shams-dev`.
5. Protected Shams chat/auth paths are rejected.
6. Every successful change creates a Git commit.
7. Verification happens before a change is considered merge-ready.
8. Main remains a separate human-controlled merge boundary.

Autonomy means independent development decisions, not unrestricted credentials.

The executor must never write to main, modify the protected Shams chat/security boundary, expose GitHub credentials to browser code, silently delete project data, or claim verification that did not happen.

The executor source is intentionally not deployed or connected yet. Activation requires explicit deployment and the two documented secrets.
