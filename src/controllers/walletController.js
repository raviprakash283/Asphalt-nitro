const walletService = require('../services/walletService');
const rewardService = require('../services/rewardService');
const inventoryService = require('../services/inventoryService');

exports.credit = async (req , res)=>{

     try{
         const user_id = req.params.playerId;
         const amount = req.body.amount;
         const reason = req.body.reason;
         const idempotencyKey =  req.get('Idempotency-Key') || req.headers['idempotency-Key']
                                           || req.headers['Idempotency-Key'];

         console.log( req.body , req.params , req.headers)

         const Result = await walletService.credit(user_id,amount , idempotencyKey, reason);

          if(!Result.success){
                 return res.status(400).json(Result);
            }

         res.json(Result).status(201);
     }
     catch(err){
        res.status(400).json({ error: err.message });
     }
}

exports.purchase = async (req,res)=> {

      try{
            const user_id =  req.params.playerId;
            const item_id = req.body.itemId;
            const price=    req.body.price;

            const idempotencyKey = req.get('Idempotency-Key') || req.headers['idempotency-Key']
                                           || req.headers['Idempotency-Key'];

            const Result = await walletService.purchase(user_id, item_id , idempotencyKey , price);
            
              if(!Result.success){
                 return res.status(400).json(Result);
              }
           

            res.json(Result).status(201);

      }
      catch(err){
        res.status(400).json({ error: err.message });
      }
}

exports.walletDetails = async(req,res) => {

      try{
           const user_id = req.params.playerId;

           const balance = await walletService.getBalance(user_id);
           const rewards = await rewardService.rewards(user_id);
           const inventory = await inventoryService.inventory(user_id);

           res.json({balance:balance.balance , inventory:inventory.inventory , claimedRewards : rewards.reward}).status(200);

      }
      catch(err){
        res.status(400).json({ error: err.message });
      }
}