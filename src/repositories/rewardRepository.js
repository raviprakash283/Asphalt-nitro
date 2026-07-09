exports.getClaimedRewards = async (client , user_id)=>{

    const reward =await client.query(
            `SELECT 
                rc.user_id,
                rc.reward_id,
                rc.created_at AS acquired_at,
                rw.title
                
             FROM rewards_claimed rc
             JOIN rewards rw ON rc.reward_id = rw.id
             WHERE rc.user_id = $1
               `,
            [user_id]
        );

         return reward.rows;
}