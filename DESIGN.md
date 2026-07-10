# database selection
 Selected Postgres sql as it supports Transaction and ACID properties and made the Table in normal Forms with Proper Primary Key and constraints.

 # Transaction
   Created a table for all type of transaction credit or debit and can be used for audit trail.

# Idempotency 
   Added idempotency_key column to transaction table to insure Idempotent transaction. No need to create seperate table for idempotency_key for a small application as it can increase overhead for cleaning the table frequently. We can just check the key from transaction table as the no. of rows are less. If the size of transaction table increases then we need to seperate idempotency key to seperate table which is for large application. 

