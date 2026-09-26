# Notaries 4 Hire

React/Vite front end with Firebase Authentication, Firestore, Hosting, and a Stripe subscription Cloud Function. The active app starts at `src/main.tsx`.

## Run locally

```sh
npm ci
npm run dev
```

`npm run build` checks TypeScript and builds the site. The root-level `App.tsx`, `views/`, and `components/` are an older unused app.

## Owner dashboard

The owner signs in normally and lands on **Owner Dashboard**. The page is also available at `/admin`. It shows listings awaiting review, all listings, hidden listings, referrals, profile reports, contact details, and commission rates. The owner can verify a listing, hide it from public pages, restore it, review and resolve profile reports, and send a Firebase password reset email to the member's Authentication address. Passwords are chosen by members through the reset link; the owner never sees them. Verification and visibility changes require confirmation; commission rates save only when the owner presses **Save rate**. The owner can open a public profile before verifying it.

Access uses a Firebase Auth custom claim (`admin: true`) and Firestore security rules. An email displayed in the browser is not sufficient for access. A notary cannot change their own `verified`, `commissionRate`, or `listingStatus` fields. Password reset checks the member's Authentication email through an admin-only Cloud Function before sending the Firebase reset email. Deploy `firestore.rules` and the Cloud Function together with the app; otherwise these controls cannot save or send.

Listing visibility is separate from billing. Hiding a listing removes it from the app's public search, home page, and profile route; it does not cancel a Stripe subscription or disable sign-in. The existing `subscriptionStatus` field is a signup-time record, not a live billing status. The owner dashboard does not present it as current billing information.

Profile reports are stored in Firestore instead of opening an email to the developer. Anyone viewing a public profile can submit a report; only the owner can read or change report status. New reports are marked open, and the owner can mark them resolved or reopen them. This inbox begins empty in production; reports previously sent by email are not imported.

Contact requests and appointment requests open an email draft to the member. The visitor must send that draft from their email app. The contact form no longer claims a message was sent when no delivery occurred. Neither type of request is stored in the owner inbox.

### One-time developer setup

1. Create or identify the owner's Firebase Authentication user in the configured Firebase project. Verify the email address with the owner before granting access. Do not use a notary subscription flow to create an owner account.
2. With Firebase Admin credentials for that project available through Application Default Credentials, run from `functions/`:

   ```sh
   npm ci
   node scripts/grant-owner.js owner@example.com
   ```

3. Ask the owner to sign out and back in to receive the new claim. Verify `/admin` loads and can save a test commission rate or verification change on an appropriate listing.

Only a developer with Firebase Admin access runs the grant script. The owner needs no Firebase console access for routine listing management.

## Deploy configuration

To publish the owner dashboard without changing the existing Stripe subscription function:

```sh
npm run build
firebase deploy --only hosting,firestore,functions:getMemberAccount --project biomednlp-8432a
```

Grant the owner claim before expecting the live page to work. The owner dashboard was deployed to the live site on September 25, 2026 with this targeted command. The existing Stripe subscription function was not redeployed.

The Cloud Function requires `STRIPE_SECRET_KEY` as a Firebase Functions secret. Set it with the Firebase CLI before deploying functions:

```sh
firebase functions:secrets:set STRIPE_SECRET_KEY
firebase deploy --only functions,firestore,hosting
```

The old Stripe secret was committed to repository history. Rotate it in Stripe and set the replacement as the function secret before deploying this change. Removing the current source line does not erase the historical exposure.
