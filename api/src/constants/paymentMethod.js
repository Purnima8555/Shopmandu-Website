

const paymentMethod = Object.freeze({
    CASH_ON_DELIVERY: "CASH_ON_DELIVERY",
    ONLINE: "ONLINE"
});

const paymentGateway = Object.freeze({
    CASH_ON_DELIVERY: "CASH_ON_DELIVERY",
    KHALTI: "KHALTI",
    ESEWA: "ESEWA",
    STRIPE: "STRIPE"
})


export  {paymentMethod, paymentGateway};

