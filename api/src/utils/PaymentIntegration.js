import axios from "axios"

import config from "../config/config.js"

//// payment integration.

class PaymentGateway {
    constructor() {
        this.return_uri = config.khalti_redirect_uri
        this.website_uri = config.web_uri
        this.khalti_POST_uri = config.khalti_request_uri
        this.khalti_secret_key = config.khalti_api,
        this.khalti_payment_lookup_uri = config.khalti_lookup_uri
    }

    async payWithKhalti(payload) {

        // console.log(this.return_uri, this.website_uri, this.khalti_POST_uri, this.khalti_secret_key)
        const { amount, purchase_order_id, purchase_order_name, customer_info } = payload
        try {

            const payRequest = await axios.post(
                this.khalti_POST_uri,
                {
                    return_url: this.return_uri,
                    website_url: this.website_uri,
                    amount,
                    purchase_order_id,
                    purchase_order_name,
                    customer_info
                },
                {
                    headers: {
                        Authorization: `Key ${this.khalti_secret_key}`,
                        "Content-Type": "application/json"
                    }
                }
            )

            // console.log(payRequest.data)
            return payRequest.data

        } catch (error) {
            console.log(error.response?.data || error.message)
            throw new Error("Khalti payment initialization failed.")
        }

    }

    async verifyKhaltiPayment(khaltiRedirectPayload) {
        const { pidx, transaction_id, total_amount } = khaltiRedirectPayload
        // console.log(pidx, transaction_id)
        try {
            const verificationResponse = await axios.post(
                this.khalti_payment_lookup_uri,
                { pidx },
                {
                    headers: {
                        Authorization: `Key ${this.khalti_secret_key}`,
                        "Content-Type": "application/json"
                    }
                }
            )
            const verifiedPayment = verificationResponse.data
            if (verifiedPayment.status === "Completed" && verifiedPayment.transaction_id === transaction_id) {
                return {
                    success: true,
                    message: "Payment verified successfully.",
                    data: verifiedPayment
                }
            }
            return {
                success: false,
                message: "Payment verification failed."
            }
        } catch (error) {
            console.log(error.response?.data || error.message)
            return {
                success: false,
                message: "Unable to verify Khalti payment."
            }

        }

    }

}


// console.log(config.khalti_redirect_uri, config)

const payment = new PaymentGateway()
export default payment;

// const payload = {
//     amount: 20 * 100,
//     purchase_order_id: "my_order_1",
//     purchase_order_name: "pay for test",
//     customer_info: {
//         name: "test user",
//         email: "example@gmail.com",
//         phone: "9800000003"
//     }

// }

// payment.payWithKhalti(payload)

