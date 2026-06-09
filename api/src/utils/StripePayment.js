import Stripe from "stripe"
import config from "../config/config.js"

class StripeGateway {
    constructor() {
        this.stripe = new Stripe(config.stripe_secret_key)
        this.return_uri = config.stripe_redirect_uri
        this.cancel_uri = config.stripe_cancel_uri
    }

    // Initializes payment, returns redirect URL
    async createCheckoutSession(payload) {
    const { amount, purchase_order_id, purchase_order_name, customer_info, items } = payload;

    try {

        const line_items = items.map((item) => ({
            quantity: item.quantity,
            price_data: {
                currency: "npr",
                unit_amount: item.price * 100, // Stripe uses paisa
                product_data: {
                    name: item.name || `Product ${item.productId}`,
                },
            },
        }));

        const session = await this.stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            mode: "payment",
            success_url: `${this.return_uri}?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: this.cancel_uri,

            customer_email: customer_info.email,

            metadata: {
                purchase_order_id: String(purchase_order_id),
            },

            line_items,
        });
        // console.log(session.url,"Sessionid:",session.id);

        return {
            url: session.url,
            sessionId: session.id,
        };

        } catch (error) {
            console.log(error.message);
            throw new Error("Stripe checkout session creation failed.");
        }
    }

    // verify
    async verifyStripePayment(sessionId) {
        try {
            const session = await this.stripe.checkout.sessions.retrieve(sessionId)

            if (session.payment_status === "paid") {
                return {
                    success: true,
                    message: "Payment verified successfully.",
                    data: {
                        sessionId: session.id,
                        purchase_order_id: session.metadata.purchase_order_id,
                        amount: session.amount_total,
                        currency: session.currency,
                        customer_email: session.customer_details.email,
                    }
                }
            }

            return {
                success: false,
                message: "Payment not completed."
            }

        } catch (error) {
            console.log(error.message)
            return {
                success: false,
                message: "Unable to verify Stripe payment."
            }
        }
    }
}

export default new StripeGateway();