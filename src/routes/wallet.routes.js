const router = require("express").Router();
const controller = require("../controllers/walletController");
const validate = require("../middlewares/validate");
const { creditSchema,  purchaseSchema} = require("../validators/wallet.validators")


router.post("/:playerId/credit", validate(creditSchema), controller.credit);
router.post("/:playerId/purchase",  validate(purchaseSchema), controller.purchase);
router.get("/:playerId", controller.walletDetails);

module.exports = router;