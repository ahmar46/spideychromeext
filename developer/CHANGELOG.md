# Changelog

## 1.2.1 — 25 November 2026

- Toolbar reminder buttons now launch directly into the active webpage.
- Ping/recovery injection repairs missing content scripts on already-open tabs.
- Direct show message replays pending reminders rather than relying only on storage changes.
- Popup closes after the page acknowledges delivery, leaving the character visible.
- Clear errors for Chrome-internal pages, muted sites and missing site access.
- Repeated test requests can replay a reminder without changing genuine counts.
- Dashboard markup and styling unchanged from 1.2.0.
- 35 automated behavioral tests passed. Live Chrome rendering remains unverified.
