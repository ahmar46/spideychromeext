# Validation — 25 November 2026

## Completed

- 35 automated tests passed with Node's built-in test runner.
- Scheduler checks cover reminder order, persistence, five-minute snooze, exactly-once completion, 20-second eye breaks, test-reminder isolation, pause/resume, configuration changes, disabled types, input validation, website preferences, local midnight and overdue reminders.
- Mocked Chrome-worker checks cover state restoration, alarm recreation, concurrent tab completions, sender-hostname constraints and eye-break completion after a worker restart.
- JavaScript syntax checks passed for background, content and popup scripts.
- Manifest JSON, runtime file paths, icon dimensions, SVG XML and promotional-tile dimensions validated. The character SVG was rasterized locally for visual inspection and its transparent surroundings checked.
- Popup element IDs and referenced local assets validated.
- Executable sources checked for fetch, XMLHttpRequest and eval calls: none found.
- Store ZIP and release ZIP integrity checks passed; upload ZIP has manifest.json at the root.
- Companion unit checks cover inline articulated SVG, cloud-after-landing timing, one entrance per reminder, climb-away on completion, unanswered automatic snooze without a completion, reduced motion, eye-break presentation, background-tab cancellation and hide-until-next-reminder.

The 1.2.1 regression tests also cover toolbar-to-page delivery, repairing a missing content script, avoiding duplicate injection, keeping genuine pending reminders, rejecting content-script launch requests, showing blocked-page/site-access errors, and closing the popup only after the page acknowledges delivery.

## Still requires a real Chrome session

- Load unpacked and exercise the character, popup, page style isolation and positioning.
- Verify alarms, focus/visibility transitions and permissions in Chrome itself.
- Check restricted-page behavior, multiple windows and website mute controls.
- Capture genuine store screenshots.

The offline preview uses the actual interface code with a simulated in-memory Chrome adapter. It does not prove browser installation, Chrome permissions, durable extension storage, service-worker lifecycle or alarm delivery. No extension was installed into a browser or submitted to a store during this build.
