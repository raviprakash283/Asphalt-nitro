exports.getBalance= async (client , user_id)=>{

     const wallet = await client.query( 'SELECT * FROM wallets WHERE user_id = $1',
        [user_id]
     ); 

     if( ! wallet || ! wallet.rows[0]){
        return new Error("wallet not found");
     }


     const balance = wallet.rows[0].balance;

     return balance;
}