const router = require("express").Router();
const controller = require("../controllers/rewardController");
const validate = require("../middlewares/validate");
const schema = require("../validators/reward.validators")

router.post("/:rewardId/claim", validate(schema.rewardSchema), controller.claimReward);


module.exports = router;