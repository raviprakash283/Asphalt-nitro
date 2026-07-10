const router = require("express").Router();
const controller = require("../controllers/walletController");
const validate = require("../middlewares/validate");
const schema = require("../validators/wallet.validators")




router.post("/:playerId/credit", validate(schema.creditSchema), controller.credit);
router.post("/:playerId/purchase",  validate(schema.purchaseSchema), controller.purchase);
router.get("/:playerId", controller.walletDetails);

module.exports = router;