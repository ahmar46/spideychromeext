# Web Buddy for Chrome

An animated companion that hangs from the corner of regular webpages and nudges you to drink water, rest your eyes, and stretch. Version 1.2.1 renders an articulated vector Spidey directly over the webpage, with a fully transparent surrounding area. He drops down on his web, bounces and sways while his head and arm move, reveals a comic cloud saying DRINK YOUR WATER!, then climbs back up and disappears. There is no picture card or gray backdrop.

## Try it on your Windows PC

1. Extract `Web_Buddy_Spidey_1.2.1.zip`.
2. In Chrome, open `chrome://extensions`.
3. Turn **Developer mode** on in the top-right corner.
4. Click **Load unpacked** and select the extracted **Web_Buddy_Spidey_1.2.1** folder itself. Select the folder containing `manifest.json`, not a ZIP or the developer folder.
5. Open or refresh a normal webpage, for example `https://example.com`. Refresh tabs that were already open when you installed or reloaded the extension.
6. Click Chrome’s puzzle-piece menu, pin **Web Buddy**, then click its toolbar icon.
7. Click **Water**, **Eyes**, or **Stretch** to try a reminder immediately. These are test reminders and never change your actual counts or schedule.

## Launch from the toolbar

Open a regular website, open Web Buddy from Chrome’s extension menu, and click Water, Eyes or Stretch. The extension checks that page for a working character script, injects one if it is missing, then tells it to show the animation directly. After the page acknowledges delivery, the toolbar popup closes so you can see Spidey. If Chrome blocks the page, the popup stays open with an explanation. A pending real reminder is preserved; clicking a test button shows it rather than discarding it.

The dashboard layout, styling, intervals, counts and settings are unchanged. The new scripting permission is used only to repair the companion in the active page after an explicit toolbar launch.

## The entrance and exit

Spidey enters over 1.2 seconds. The cloud pops in after he settles. An unanswered water/stretch nudge stays for roughly 14 seconds from arrival, then snoozes for five minutes while Spidey climbs away over about a second. Test reminders simply dismiss. No completion is recorded without pressing Done. Starting an eye break keeps him present until that 20-second break finishes. Dismissing, closing, or completing a reminder also sends him back up. Reduced motion shows and hides him immediately, without travel or limb animation.

## Everyday controls

- Click the floating character to open or close its little message card.
- Hover over it to reveal **Hide** and **Mute site**. **Hide** hides idle animation in this tab until a new reminder. During a reminder it snoozes that reminder. **Mute site** hides all buddy UI on this exact hostname until you re-enable it from the popup.
- The popup lets you choose four corners, three sizes, always-visible or reminder-only mode, and reduced motion. Your operating system’s reduced-motion preference is respected too.
- Water defaults to 45 minutes, eyes to 20, and stretch to 60. Each can be disabled or changed to a whole number from 1–240 minutes.
- **Pause** freezes reminder clocks until **Resume**, including across browser restarts. A 20-second eye break that you explicitly start will still finish while paused.
- **In 5 min** postpones a real reminder; the close button and Escape do the same. Chrome may delay background alarms during sleep or resource-saving modes.
- Only one reminder is pending at a time across tabs. Completion is synchronized, so completing it in two tabs adds one count. Different windows may display the same reminder, but completion is still shared.
- **Re-enable all hidden websites** restores all hostnames muted through Web Buddy. Global reminder timers continue while a site is muted; no reminder is shown on that site.

## What to expect

The character is an overlay inside webpages, not part of Chrome’s toolbar or browser frame. Chrome blocks injection on internal pages such as `chrome://extensions`, the Chrome Web Store, the built-in New Tab page, and some special viewers. Local files and embedded frames are not supported. Incognito use is not enabled by default. Pages with fullscreen/top-layer UI may cover the companion. A site can remove injected UI; refreshing the page restores it.

Timers use wall-clock deadlines and persistent local storage. If Chrome closes or the computer sleeps, they resume when Chrome next wakes the extension; a missed reminder may appear then. Overdue reminders are serialized with at least a minute after a real completion/snooze. The extension does not wake a sleeping computer or show system notifications when you are outside Chrome. Eye-break timing uses an absolute end time; foreground UI completes it after 20 seconds, while background-only completion can be delayed by Chrome’s alarm scheduling.

Completed breaks are self-reported local counts, not measurements of water consumed or medical outcomes. A new local date clears totals when the extension next runs. No accounts, telemetry, external requests, or Chrome Sync storage are used. A fresh installation shows Spidey only for reminders by default. The popup can keep him visible. If replacing the previous extension, remove that copy first to avoid duplicate reminders; this clears its saved preferences.

## Publish on the Chrome Web Store

Read **PUBLISH.md**. Upload **Web_Buddy_Spidey_Store_1.2.1.zip**, which contains `manifest.json` at its root. Do not upload this whole release ZIP. The release includes source, tests, store description, permission justifications, a privacy-policy page you can host, a 128-pixel icon, and a 440×280 promotional tile.

Before submitting, test in your installed Chrome, capture at least one real screenshot, host the privacy policy at a public HTTPS URL, and complete your developer-account and store disclosures. Store approval has not been obtained or promised. This package has not been uploaded or published.

## Source and build

The installable extension is directly at the ZIP root. The editable project is in `developer/`, which has its own `extension/` source folder. `core.mjs` owns reminder state and validation; `background.js` serializes local state changes and uses Chrome alarms. `popup.*` is the toolbar UI. The root `content.template.js` and `content.css` build the isolated shadow-DOM companion. `build.py` bundles those assets and generates icons and ZIPs.

Run `npm test` for state-machine and mocked Chrome-worker tests. Run `python3 build.py` to rebuild; Python 3 with Pillow is needed only to generate image assets. No JavaScript dependencies, npm install, server, bundler, or compilation are required to load the completed extension. A real Chrome session is still required for installation, rendering, restricted-page behavior, and store screenshots.
