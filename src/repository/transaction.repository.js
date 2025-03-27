const db = require("../database/pg.database");

exports.createTransaction = async (transaction) => {
  console.log(transaction);

  try {
    const res = await db.query(
      "INSERT INTO transactions (user_id, item_id, quantity, total) VALUES ($1, $2, $3, $4) RETURNING *",
      [
        transaction.user_id,
        transaction.item_id,
        transaction.quantity,
        transaction.total,
      ]
    );
    return res.rows[0];
  } catch (error) {
    console.error("Error executing query", error);
  }
};

exports.payTransaction = async (id) => {
  try {
    const res = await db.query(
      "UPDATE transactions SET status = 'paid' WHERE id = $1 RETURNING *",
      [id]
    );
    return res.rows[0];
  } catch (error) {
    console.error("Error executing query", error);
  }
};

exports.deleteTransaction = async (id) => {
  try {
    const res = await db.query(
      "DELETE FROM transactions WHERE id = $1 RETURNING *",
      [id]
    );
    return res.rows[0];
  } catch (error) {
    console.error("Error executing query", error);
  }
};

exports.getTransactionById = async (id) => {
  try {
    const res = await db.query("SELECT * FROM transactions WHERE id = $1", [
      id,
    ]);
    return res.rows[0];
  } catch (error) {
    console.error("Error executing query", error);
  }
};

exports.getAllTransactions = async () => {
  try {
    const res = await db.query(
      "SELECT transactions.id AS transaction_id, transactions.user_id, transactions.item_id,transactions.quantity, transactions.total, transactions.status, transactions.created_at AS transaction_created_at, users.id AS user_id, users.name AS user_name, users.email AS user_email,users.password AS user_password, users.balance AS user_balance, users.created_at AS user_created_at, items.id AS item_id, items.name AS item_name, items.price AS item_price, items.store_id AS item_store_id, items.image_url AS item_image_url, items.stock AS item_stock, items.created_at AS item_created_at FROM transactions JOIN items ON transactions.item_id = items.id JOIN users ON transactions.user_id = users.id"
    );
    return res.rows;
  } catch (error) {
    console.error("Error executing query", error);
  }
};
