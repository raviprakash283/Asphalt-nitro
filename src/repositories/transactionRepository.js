exports.findByKey = async (client, key) => {
    return client.query(
        `SELECT * FROM transactions WHERE idempotency_key=$1`,
        [key]
    );
};

exports.storeTransaction = async (client,walletId ,idempotencyKey, type,price,reason)=> {

         const txRes = await client.query(
                `INSERT INTO transactions 
                 (wallet_id, idempotency_key, type, amount, reason) 
                 VALUES ($1, $2, $3, $4, $5 ) RETURNING *`,
                [walletId, idempotencyKey, type,price,reason]
            );

            return txRes.rows[0];

}