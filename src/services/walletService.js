const pool = require('../config/db');
const {findByKey ,  storeTransaction } = require('../repositories/transactionRepository')
const {getBalance} = require('../repositories/walletRepository');

exports.credit = async (user_id, amount, idempotencyKey,reason) => {
        const client = await pool.connect();
        try {
            await client.query('BEGIN');

            // Check idempotency
            const existing = await findByKey(client ,idempotencyKey);

            if (existing.rows.length > 0) {
                await client.query('ROLLBACK');
                return { success: true, transaction: existing.rows[0], isIdempotent: true };
            }

            // Get wallet with lock
            const walletRes = await client.query(
                'SELECT * FROM wallets WHERE user_id = $1 FOR UPDATE',
                [user_id]
            );

            if (walletRes.rows.length === 0) {
                await client.query('ROLLBACK');
                throw new Error('Wallet not found');
            }

            const wallet = walletRes.rows[0];

            // Create transaction record
            const txRes = await storeTransaction(client,wallet.id,idempotencyKey,'CREDIT', amount ,reason)
            

            // Update balance
            await client.query(
                'UPDATE wallets SET balance = balance + $1 WHERE id = $2',
                [amount, wallet.id]
            );

            await client.query('COMMIT');
            return { success: true, transaction: txRes };
        } catch (err) {
            await client.query('ROLLBACK');
            throw err;
        } finally {
            client.release();
        }
    }


exports.purchase = async (user_id,item_id, idempotencyKey,price) => {
        const client = await pool.connect();
        try {
            await client.query('BEGIN');

            // Idempotency check
            const existing = await findByKey(client ,idempotencyKey);

            if (existing.rows.length > 0) {
                await client.query('ROLLBACK');
                return { success: true, transaction: existing.rows[0], isIdempotent: true };
            }

            // check if item already exist in inventory
            const itemExist = await client.query(
                'SELECT * FROM inventory WHERE user_id = $1 AND item_id= $2',
                [user_id , item_id]
            )

            if(itemExist.rows.length){
                throw new Error('Item already exist in inventory');
            }

            // Lock wallet
            const walletRes = await client.query(
                'SELECT * FROM wallets WHERE user_id = $1 FOR UPDATE',
                [user_id]
            );

            const wallet = walletRes.rows[0];
            if (!wallet || wallet.balance < price ) {
                await client.query('ROLLBACK');
                throw new Error('Insufficient balance');
            }
            
            const reason = "purchasing item";
            const txRes = await storeTransaction(client,wallet.id,idempotencyKey,'DEBIT', price,reason);
            

            await client.query(
                'UPDATE wallets SET balance = balance - $1 WHERE id = $2',
                [price, wallet.id]
            );

            const inventoryRes = await client.query(
                `INSERT INTO inventory (user_id, item_id)
                    VALUES ($1, $2)
                    RETURNING *`,
                    [user_id, item_id]
                );

            await client.query('COMMIT');
            return { success: true, transaction: txRes };
        } catch (err) {
            await client.query('ROLLBACK');
            throw err;
        } finally {
            client.release();
        }
    }

exports.getBalance = async(user_id)=>{
      const client = await pool.connect();

      try{
           const balance = await getBalance(client, user_id);
        return  { success:true , balance:balance};
      }
      catch(err){
        throw err;
      }
      finally{
        client.release();
      }

}