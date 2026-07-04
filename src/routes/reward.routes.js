const router = require("express").Router();
const controller = require("../controllers/rewardController");
const validate = require("../middlewares/validate");
const {rewardSchema} = require("../validators/reward.validators")

router.post("/:rewardId/claim", validate(rewardSchema), controller.claimReward);


module.exports = router;