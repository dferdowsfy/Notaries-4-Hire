const functions = require("firebase-functions");
const admin = require("firebase-admin");
const Stripe = require("stripe");

admin.initializeApp();

// Initialize Stripe with the Secret Key
const stripe = new Stripe("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");

// REPLACE THIS WITH YOUR ACTUAL STRIPE PRICE ID FOR THE SUBSCRIPTION
// You can find this in your Stripe Dashboard under Products -> [Your Product] -> Pricing
const STRIPE_PRICE_ID = "price_1SaNFNJcVbd9A9TaMKF6V2s5";

exports.createStripeSubscription = functions.https.onCall(async (data, context) => {
    // 1. Check authentication
    if (!context.auth) {
        throw new functions.https.HttpsError(
            "unauthenticated",
            "The function must be called while authenticated."
        );
    }

    const { email, name, paymentMethodId, couponCode, userId } = data;

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

        // 4. Update Firestore with Stripe Customer ID (optional, but good practice)
        // The client also does this, but doing it here is safer.
        await admin.firestore().collection("notaries").doc(userId).update({
            stripeCustomerId: customer.id,
            stripeSubscriptionId: subscription.id
        });

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
