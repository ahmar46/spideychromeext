# Store privacy and permission answers

Review the current dashboard wording yourself. These statements describe the included 1.2.1 source.

## Single purpose

Provide an animated on-page companion for water, eye-break and stretch reminders, with local scheduling and user-controlled display settings.

## Permissions

**storage:** Save reminder intervals, enable/disable choices, appearance preferences, pause state, pending reminders, deadlines, disabled hostnames, and daily counts locally across browser restarts.

**alarms:** Wake the Manifest V3 background worker to process persistent deadlines and complete eye breaks without long-running service-worker timers.

**activeTab:** When the user clicks the extension action, identify the active webpage’s hostname so the popup can enable/disable the companion there. Full URLs are not stored or transmitted.

**HTTP/HTTPS content-script matches:** Insert the companion and reminders into regular websites. The product shows reminders across the websites the user visits. It uses visibility state and hostname for display, does not inspect page text or form data, and does not collect browsing history. Only hostnames explicitly muted are stored locally.

## Remote code

No remote code. All JavaScript, styles and artwork are packaged. No eval, remote scripts or external service calls.

## User data

No data is transmitted off the device. Data is not sold or shared. There is no analytics collection, user identification, or third-party transmission. Local preferences, disabled-site hostnames, and self-reported counts perform the single purpose.

Use the dashboard’s current definition of collection for its checkboxes. Do not claim there is no local storage or no website access. Confirm that the submitted build matches this policy and that all required certifications are accurate.

## Privacy policy

Host `extension/privacy.html` and `privacy.css` on a public HTTPS website and enter that URL. The local policy page cannot serve as a public store policy URL.

The character and comic cloud are native inline SVG. No raster image or web-accessible resource is needed. Unanswered reminders automatically snooze after the presentation; this creates no completion count.

**scripting:** After the user explicitly launches a reminder from the toolbar, verify that the current page has a working companion script and inject the packaged content.js if needed. This recovers tabs opened before installation and stale unpacked-extension contexts. Injection uses activeTab permission, reads no page text and performs no external requests.
