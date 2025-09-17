const pool = require('../config/db');
const Transaction = require('./Transaction'); // Importa o modelo de transações

const createDebt = async (userId, description, amount, dueDate, type, status) => {
  const queryResult = await pool.query(
    'INSERT INTO debts (user_id, description, amount, due_date, type, status) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *'
    ,
    [userId, description, amount, dueDate, type, status]
  );
  return queryResult.rows[0];
};

const getDebtsByUserId = async (userId) => {
  const queryResult = await pool.query(
    'SELECT * FROM debts WHERE user_id = $1 ORDER BY due_date ASC',
    [userId]
  );
  return queryResult.rows;
};

const getDebtById = async (id, userId) => {
  const queryResult = await pool.query(
    'SELECT * FROM debts WHERE id = $1 AND user_id = $2',
    [id, userId]
  );
  return queryResult.rows[0];
};

const updateDebt = async (id, userId, description, amount, dueDate, type, status) => {
  let transactionId = null;

  // Se o status da dívida for atualizado para 'paid'
  if (status === 'paid') {
    // Busca a dívida existente para verificar o status anterior
    const existingDebt = await getDebtById(id, userId);

    // Cria uma transação de despesa se a dívida ainda não tiver uma transação associada
    if (!existingDebt.transaction_id) {
      const newTransaction = await Transaction.createTransaction(
        userId,
        `Pagamento de dívida: ${description}`,
        amount,
        'expense',
        new Date(), // Data atual como data de pagamento
        null // categoryId (pode ser ajustado para uma categoria padrão de dívidas)
      );
      transactionId = newTransaction.id;
    } else {
      transactionId = existingDebt.transaction_id;
    }
  }

  const queryResult = await pool.query(
    'UPDATE debts SET description = $1, amount = $2, due_date = $3, type = $4, status = $5, transaction_id = $8 WHERE id = $6 AND user_id = $7 RETURNING *'
    ,
    [description, amount, dueDate, type, status, id, userId, transactionId]
  );
  return queryResult.rows[0];
};

const deleteDebt = async (id, userId) => {
  const queryResult = await pool.query(
    'DELETE FROM debts WHERE id = $1 AND user_id = $2 RETURNING id',
    [id, userId]
  );
  return queryResult.rows[0];
};

module.exports = {
  createDebt,
  getDebtsByUserId,
  getDebtById,
  updateDebt,
  deleteDebt,
};
