const pool = require('../config/db');

exports.rewards = async(user_id)=>{
         const client = await pool.connect();
    try{
          const rewardRes = await client.query('SELECT * FROM rewards_claimed WHERE user_id = $1',
            [user_id]
          )

          return { success : true , reward : rewardRes.rows};
   
    }
    catch(err){
       throw err;
    }
    finally{
        client.release();
     }

}

exports.claimReward = async(user_id , reward_id)=>{
     const client = await pool.connect();

     try{
          const rewardRes = await  client.query(
            `INSERT INTO rewards_claimed (reward_id, user_id)
            VALUES ($1, $2)
            RETURNING *`,
            [reward_id,user_id]
          );

          // Check if the reward was actually inserted
        if (rewardRes.rowCount === 0) {
            // Reward was already claimed by this user
            return {
                success: false,
                message: "Reward already claimed",
                alreadyClaimed: true
            };
        }

        // Successfully claimed
        return {
            success: true,
            message: "Reward claimed successfully",
            data: rewardRes.rows[0]
        }
     }
     catch(err){
         throw err;
     }
     finally{
        client.release();
     }
}