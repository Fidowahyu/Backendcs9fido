const db = require("../database/pg.database");

exports.userRegister = async (user) => {
  try {
    const res = await db.query(
      "INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING *",
      [user.name, user.email, user.password]
    );
    return res.rows[0];
  } catch (error) {
    console.error("Error executing query", error);
  }
};

exports.userLogin = async (user) => {
  console.log(user);
  try {
    const res = await db.query(
      "SELECT * FROM users WHERE email = $1 AND password = $2",
      [user.email, user.password]
    );
    return res.rows[0];
  } catch (error) {
    console.error("Error executing query", error);
  }
};

exports.getUserByEmail = async (email) => {
  try {
    const res = await db.query("SELECT * FROM users WHERE email = $1", [email]);
    return res.rows[0];
  } catch (error) {
    console.error("Error executing query", error);
  }
};

exports.updateUser = async (id, user) => {
  try {
    const res = await db.query(
      "UPDATE users SET name = $1, email = $2, password = $3 WHERE id = $4 RETURNING *",
      [user.name, user.email, user.password, id]
    );
    return res.rows[0];
  } catch (error) {
    console.error("Error executing query", error);
  }
};

exports.deleteUser = async (id) => {
  try {
    const res = await db.query("DELETE FROM users WHERE id = $1 RETURNING *", [
      id,
    ]);
    console.log(res);
    return res.rows[0];
  } catch (error) {
    console.error("Error executing query", error);
  }
};

exports.userTopUp = async (id, amount) => {
  try {
    const res = await db.query(
      "UPDATE users SET balance = balance + $1 WHERE id = $2 RETURNING *",
      [amount, id]
    );
    return res.rows[0];
  } catch (error) {
    console.error("Error executing query", error);
  }
};

exports.getUserById = async (id) => {
  try {
    const res = await db.query("SELECT * FROM users WHERE id = $1", [id]);
    return res.rows[0];
  } catch (error) {
    console.error("Error executing query", error);
  }
};
