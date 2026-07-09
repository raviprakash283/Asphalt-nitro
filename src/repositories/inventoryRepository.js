exports.getInventory = async (client , user_id)=>{

    const inventory =await client.query(
            `SELECT 
                i.id AS inventory_id,
                i.user_id,
                i.item_id,
                i.created_at AS acquired_at,
                it.title
             FROM inventory i
             JOIN items it ON i.item_id = it.id
             WHERE i.user_id = $1
               `,
            [user_id]
        );

         return inventory.rows;
}