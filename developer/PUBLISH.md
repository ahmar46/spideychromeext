# Publish Web Buddy on the Chrome Web Store

Version 1.2.1 includes a code-drawn Spider-Man-style vector character inspired by the supplied reference. It is not an official or licensed Marvel product. Confirm character/branding rights for public distribution before submission; the software license does not grant rights to the character likeness.

## 1. Test the actual Chrome extension

Load the extracted release folder (containing `manifest.json`) through `chrome://extensions` → Developer mode → Load unpacked. Refresh a regular webpage. Confirm all three test reminders, corners and sizes, pause/resume, reminder-only mode, reduced motion, mute/re-enable site, and a 20-second eye break. For a real reminder, temporarily set water to one minute, wait on a normal page, complete it, and verify the count. Reload the extension or restart Chrome to check persistence, then restore your preferred intervals. Check the extension’s Errors panel and background service-worker console.

Automated behavior tests passed during development. Browser UI testing was not completed in this workspace; perform the actual Chrome checks above before submitting.

## 2. Register a developer account

Open https://chrome.google.com/webstore/devconsole and sign in to the Google account that should own the extension. Complete registration and Google’s one-time registration payment if needed. Complete the dashboard’s account-verification and two-step-verification requirements. You must personally accept agreements and complete payments.

Official instructions: https://developer.chrome.com/docs/webstore/register/

## 3. Prepare public information

- Add a public developer/support contact in the dashboard. The included privacy policy refers to that contact; replace it with your email if preferred.
- Host `privacy.html` and `privacy.css` together on a public HTTPS website. Outside the extension, change its logo link from `popup.html` to your homepage or remove it. Enter the final privacy URL in the dashboard. A local or `chrome-extension://` URL is not a public policy link.
- Read `store/PRIVACY_DISCLOSURES.md` and ensure your answers describe the submitted build.
- Use `store/LISTING.md` for listing copy and category guidance.
- Upload `store/icon128.png` and `store/promo440x280.png` where requested.
- Capture at least one real 1280×800 screenshot of Web Buddy working in Chrome. Use a page with no personal data and the companion/reminder visible. A second screenshot can show settings. Do not use the promotional illustration as a product screenshot. Up to five screenshots are supported; follow any updated dimensions requested by the dashboard.

## 4. Upload the correct ZIP

Click **New item / Add new item**. Upload `Web_Buddy_Spidey_Store_1.2.1.zip`. It contains runtime files, icons, privacy page, and license, with `manifest.json` at its root. Do not upload `Web_Buddy_Spidey_1.2.1.zip`.

Complete Store listing, Privacy practices, and Distribution. The single purpose is a visible browsing companion for water, eye-break and stretch reminders. Explain its regular-webpage content-script matches using `store/PRIVACY_DISCLOSURES.md`.

## 5. Review, then submit

Review listing fields, privacy answers, screenshots, contact and URLs. Submit for Google’s review when satisfied. Approval and timing are Google’s decision. This package has not created an account, paid a fee, accepted an agreement, or submitted an extension for you.

## Updates

Increase `version` in `extension/manifest.json`, update the changelog, rebuild the Store ZIP, retest, and upload it to your existing store item.

Official references checked on 24 November 2026:

- https://developer.chrome.com/docs/webstore/publish/
- https://developer.chrome.com/docs/webstore/cws-dashboard-listing/
- https://developer.chrome.com/docs/webstore/cws-dashboard-privacy/
- https://developer.chrome.com/docs/extensions/reference/api/alarms
