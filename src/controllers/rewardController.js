const rewardservice = require('../services/rewardService');

exports.claimReward = async(req ,res)=>{

    try{
         const  reward_id = req.params.rewardId;
         const user_id = req.body.playerId;

         const result = await rewardservice.claimReward(user_id,reward_id);

         if (!result.success) {
        return res.status(400).json(result);
        }

         res.json(result).status(201);
    }
    catch(err){
          res.status(400).json({ error: err.message });
    }
}