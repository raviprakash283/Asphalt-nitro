const { z } = require("zod");

const rewardSchema = z.object({
    playerId: z
        .number({
            required_error: "playerId required",
        })
        .int()
        .positive()
        .max(Number.MAX_SAFE_INTEGER), // Safe limit
});

module.exports = {
    rewardSchema
};