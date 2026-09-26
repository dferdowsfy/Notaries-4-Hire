const functions = require("firebase-functions");
const admin = require("firebase-admin");
const Stripe = require("stripe");

admin.initializeApp();

// Configure STRIPE_SECRET_KEY in the Cloud Functions environment.

// REPLACE THIS WITH YOUR ACTUAL STRIPE PRICE ID FOR THE SUBSCRIPTION
// You can find this in your Stripe Dashboard under Products -> [Your Product] -> Pricing
const STRIPE_PRICE_ID = "price_1SaNFNJcVbd9A9TaMKF6V2s5";

exports.getMemberAccount = functions.https.onCall(async (data, context) => {
    if (context.auth?.token?.admin !== true) {
        throw new functions.https.HttpsError("permission-denied", "Owner access required.");
    }
    const uid = data?.uid;
    if (typeof uid !== "string" || !uid || uid.length > 128) {
        throw new functions.https.HttpsError("invalid-argument", "A member ID is required.");
    }
    const listing = await admin.firestore().collection("notaries").doc(uid).get();
    if (!listing.exists) {
        throw new functions.https.HttpsError("not-found", "Member listing not found.");
    }
    try {
        const member = await admin.auth().getUser(uid);
        return { email: member.email || null, disabled: member.disabled };
    } catch (error) {
        if (error.code === "auth/user-not-found") {
            throw new functions.https.HttpsError("not-found", "Member account not found.");
        }
        throw error;
    }
});

exports.createStripeSubscription = functions.runWith({ secrets: ["STRIPE_SECRET_KEY"] }).https.onCall(async (data, context) => {
    // 1. Check authentication
    if (!context.auth) {
        throw new functions.https.HttpsError(
            "unauthenticated",
            "The function must be called while authenticated."
        );
    }

    const { email, name, paymentMethodId, couponCode } = data;
    const userId = context.auth.uid;
    const stripeKey = process.env.STRIPE_SECRET_KEY;
    if (!stripeKey) {
        throw new functions.https.HttpsError("failed-precondition", "Stripe is not configured.");
    }
    const stripe = new Stripe(stripeKey);

    try {
        // 2. Create a Stripe Customer
        const customerParams = {
            email: email,
            name: name,
            metadata: {
                firebaseUID: userId,
            },
        };

        if (paymentMethodId) {
            customerParams.payment_method = paymentMethodId;
            customerParams.invoice_settings = {
                default_payment_method: paymentMethodId,
            };
        }

        const customer = await stripe.customers.create(customerParams);

        // 3. Create the Subscription
        const subscriptionParams = {
            customer: customer.id,
            items: [{ price: STRIPE_PRICE_ID }],
            expand: ["latest_invoice.payment_intent"],
        };

        // Apply promotion code if provided
        // Note: Stripe uses 'promotion_code' for the promo code ID, not 'coupon'
        // We need to look up the promotion code by the code string first
        if (couponCode) {
            try {
                // Look up the promotion code by the code string (e.g., "FRIENDS25")
                const promoCodes = await stripe.promotionCodes.list({
                    code: couponCode,
                    active: true,
                    limit: 1
                });

                if (promoCodes.data.length > 0) {
                    // Use the promotion code ID
                    subscriptionParams.promotion_code = promoCodes.data[0].id;
                } else {
                    throw new Error(`No active promotion code found for: ${couponCode}`);
                }
            } catch (promoError) {
                console.error("Promotion code error:", promoError);
                throw new functions.https.HttpsError("invalid-argument", `Invalid promotion code: ${couponCode}`);
            }
        }

        const subscription = await stripe.subscriptions.create(subscriptionParams);

        return {
            subscriptionId: subscription.id,
            customerId: customer.id,
            status: subscription.status,
            clientSecret: subscription.latest_invoice?.payment_intent?.client_secret || null,
        };

    } catch (error) {
        console.error("Stripe error:", error);
        throw new functions.https.HttpsError("internal", error.message);
    }
});
