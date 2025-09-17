const pool = require('../config/db');

const createTransaction = async (userId, description, amount, type, date, categoryId) => {
  const res = await pool.query(
    'INSERT INTO transactions (user_id, description, amount, type, date, category_id) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *'
    ,
    [userId, description, amount, type, date, categoryId]
  );
  return res.rows[0];
};

const getTransactionsByUserId = async (userId) => {
  const res = await pool.query(
    'SELECT t.*, c.name AS category_name FROM transactions t LEFT JOIN categories c ON t.category_id = c.id WHERE t.user_id = $1 ORDER BY t.date DESC'
    ,
    [userId]
  );
  return res.rows;
};

const getTransactionById = async (id, userId) => {
  const res = await pool.query(
    'SELECT t.*, c.name AS category_name FROM transactions t LEFT JOIN categories c ON t.category_id = c.id WHERE t.id = $1 AND t.user_id = $2'
    ,
    [id, userId]
  );
  return res.rows[0];
};

const updateTransaction = async (id, userId, description, amount, type, date, categoryId) => {
  const res = await pool.query(
    'UPDATE transactions SET description = $1, amount = $2, type = $3, date = $4, category_id = $5 WHERE id = $6 AND user_id = $7 RETURNING *'
    ,
    [description, amount, type, date, categoryId, id, userId]
  );
  return res.rows[0];
};

const deleteTransaction = async (id, userId) => {
  const res = await pool.query(
    'DELETE FROM transactions WHERE id = $1 AND user_id = $2 RETURNING id',
    [id, userId]
  );
  return res.rows[0];
};

module.exports = {
  createTransaction,
  getTransactionsByUserId,
  getTransactionById,
  updateTransaction,
  deleteTransaction,
};
