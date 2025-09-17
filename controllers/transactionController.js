const Transaction = require('../models/Transaction');
const pool = require('../config/db'); // Importa o pool diretamente aqui

// @route   POST api/transactions
// @desc    Criar uma nova transação
// @access  Private
const createTransaction = async (req, res) => {
  const { description, amount, type, date, category_id } = req.body;
  const userId = req.user.id; // Obtido do middleware de autenticação

  try {
    const newTransaction = await Transaction.createTransaction(userId, description, amount, type, date, category_id);
    res.status(201).json(newTransaction);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Erro no servidor');
  }
};

// @route   GET api/transactions
// @desc    Obter todas as transações de um usuário com filtros e ordenação
// @access  Private
const getTransactions = async (req, res) => {
  const userId = req.user.id;
  const { type, category_id, sortBy = 'date', sortOrder = 'desc' } = req.query;

  let query = 'SELECT t.*, c.name AS category_name FROM transactions t LEFT JOIN categories c ON t.category_id = c.id WHERE t.user_id = $1';
  const queryParams = [userId];
  let paramIndex = 2;

  if (type) {
    query += ` AND t.type = $${paramIndex}`;
    queryParams.push(type);
    paramIndex++;
  }

  if (category_id) {
    query += ` AND t.category_id = $${paramIndex}`;
    queryParams.push(category_id);
    paramIndex++;
  }

  // Ordenação
  const validSortBy = ['date', 'amount'];
  const validSortOrder = ['asc', 'desc'];
  const finalSortBy = validSortBy.includes(sortBy) ? sortBy : 'date';
  const finalSortOrder = validSortOrder.includes(sortOrder) ? sortOrder : 'desc';

  query += ` ORDER BY t.${finalSortBy} ${finalSortOrder}`;

  try {
    const queryResult = await pool.query(query, queryParams);
    res.status(200).json(queryResult.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Erro no servidor');
  }
};

// @route   GET api/transactions/:id
// @desc    Obter uma transação específica de um usuário
// @access  Private
const getTransactionById = async (req, res) => {
  const transactionId = req.params.id;
  const userId = req.user.id;

  try {
    const transaction = await Transaction.getTransactionById(transactionId, userId);
    if (!transaction) {
      return res.status(404).json({ message: 'Transação não encontrada' });
    }
    res.json(transaction);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Erro no servidor');
  }
};

// @route   PUT api/transactions/:id
// @desc    Atualizar uma transação existente
// @access  Private
const updateTransaction = async (req, res) => {
  const transactionId = req.params.id;
  const { description, amount, type, date, category_id } = req.body;
  const userId = req.user.id;

  try {
    const updatedTransaction = await Transaction.updateTransaction(transactionId, userId, description, amount, type, date, category_id);
    if (!updatedTransaction) {
      return res.status(404).json({ message: 'Transação não encontrada' });
    }
    res.json(updatedTransaction);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Erro no servidor');
  }
};

// @route   DELETE api/transactions/:id
// @desc    Deletar uma transação
// @access  Private
const deleteTransaction = async (req, res) => {
  const transactionId = req.params.id;
  const userId = req.user.id;

  try {
    const deletedTransaction = await Transaction.deleteTransaction(transactionId, userId);
    if (!deletedTransaction) {
      return res.status(404).json({ message: 'Transação não encontrada' });
    }
    res.json({ message: 'Transação removida' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Erro no servidor');
  }
};

// @route   GET api/transactions/summary
// @desc    Obter um resumo financeiro (total de entradas, saídas, balanço)
// @access  Private
const getFinancialSummary = async (req, res) => {
  const userId = req.user.id;

  try {
    const incomeResult = await pool.query(
      'SELECT COALESCE(SUM(amount), 0) AS total_income FROM transactions WHERE user_id = $1 AND type = \'income\'',
      [userId]
    );
    const expenseResult = await pool.query(
      'SELECT COALESCE(SUM(amount), 0) AS total_expense FROM transactions WHERE user_id = $1 AND type = \'expense\'',
      [userId]
    );

    const totalIncome = parseFloat(incomeResult.rows[0].total_income);
    const totalExpense = parseFloat(expenseResult.rows[0].total_expense);
    const balance = totalIncome - totalExpense;

    res.json({
      totalIncome,
      totalExpense,
      balance,
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Erro no servidor');
  }
};

module.exports = {
  createTransaction,
  getTransactions,
  getTransactionById,
  updateTransaction,
  deleteTransaction,
  getFinancialSummary, // Exporta a nova função
};
