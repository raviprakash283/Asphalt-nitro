const { z } = require("zod");

exports.creditSchema = z.object({
    amount: z
        .number({
            required_error: "amount required"
        })
        .int()
        .positive()
        .max(Number.MAX_SAFE_INTEGER),

    reason: z
        .string({
            required_error: "reason required"
        })
        .min(1)
        .max(255)
});

exports.purchaseSchema = z.object({
    itemId: z
        .number({
            required_error: "itemId required"
        })
        .int()
        .positive()
        .max(Number.MAX_SAFE_INTEGER),
        

    price: z
        .number({
            required_error: "price required"
        })
        .int()
        .positive()
        .max(Number.MAX_SAFE_INTEGER)
});

