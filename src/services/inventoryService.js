const pool = require('../config/db');
const {getInventory} = require('../repositories/inventoryRepository');

exports.inventory = async(user_id)=>{
      
      const client = await pool.connect();
    try{
         const inventory = await getInventory(client,user_id);

         return {success : true , inventory : inventory};
    }
    catch(err){
        throw err;
      }
      finally{
        client.release();
      }
}