import config from "./config.js";



const paymentGatewayConfig = Object.freeze({
    KHALTI: {
        return_uri: config.khalti_redirect_uri,
        website_uri: config.web_uri,
        khalti_POST_uri: config.khalti_request_uri,
        khalti_secret_key: config.khalti_api,
        khalti_payment_lookup_uri: config.khalti_lookup_uri,
    },

    STRIPE: {
        secret_key: config.stripe_secret_key,
        publishable_key: config.stripe_publishable_key,

        success_url: `${config.web_uri}/api/payment/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${config.web_uri}/api/payment/cancel`,
    }
})

export default paymentGatewayConfig;