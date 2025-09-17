const pool = require('../config/db');

const createCategory = async (userId, name, type) => {
  const queryResult = await pool.query(
    'INSERT INTO categories (user_id, name, type) VALUES ($1, $2, $3) RETURNING *'
    ,
    [userId, name, type]
  );
  return queryResult.rows[0];
};

const getCategoriesByUserId = async (userId) => {
  const queryResult = await pool.query(
    'SELECT * FROM categories WHERE user_id = $1 ORDER BY name ASC',
    [userId]
  );
  return queryResult.rows;
};

const getCategoryById = async (id, userId) => {
  const queryResult = await pool.query(
    'SELECT * FROM categories WHERE id = $1 AND user_id = $2',
    [id, userId]
  );
  return queryResult.rows[0];
};

const updateCategory = async (id, userId, name, type) => {
  const queryResult = await pool.query(
    'UPDATE categories SET name = $1, type = $2 WHERE id = $3 AND user_id = $4 RETURNING *'
    ,
    [name, type, id, userId]
  );
  return queryResult.rows[0];
};

const deleteCategory = async (id, userId) => {
  const queryResult = await pool.query(
    'DELETE FROM categories WHERE id = $1 AND user_id = $2 RETURNING id',
    [id, userId]
  );
  return queryResult.rows[0];
};

module.exports = {
  createCategory,
  getCategoriesByUserId,
  getCategoryById,
  updateCategory,
  deleteCategory,
};
