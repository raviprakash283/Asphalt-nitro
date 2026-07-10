const { z } = require("zod");

exports.rewardSchema = z.object({
    playerId: z
        .number({
            required_error: "playerId required",
        })
        .int()
        .positive()
        .max(Number.MAX_SAFE_INTEGER), // Safe limit
});

