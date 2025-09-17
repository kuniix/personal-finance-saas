const Debt = require('../models/Debt');
const pool = require('../config/db'); // Importa o pool diretamente aqui para a query de filtro/ordenação

// @route   POST api/debts
// @desc    Criar uma nova dívida
// @access  Private
const createDebt = async (req, res) => {
  const { description, amount, due_date, type, status } = req.body;
  const userId = req.user.id; // Obtido do middleware de autenticação

  try {
    const newDebt = await Debt.createDebt(userId, description, amount, due_date, type, status);
    res.status(201).json(newDebt);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Erro no servidor');
  }
};

// @route   GET api/debts
// @desc    Obter todas as dívidas de um usuário com filtros e ordenação
// @access  Private
const getDebts = async (req, res) => {
  const userId = req.user.id;
  const { type, status, sortBy = 'due_date', sortOrder = 'asc' } = req.query;

  let query = 'SELECT * FROM debts WHERE user_id = $1';
  const queryParams = [userId];
  let paramIndex = 2;

  if (type) {
    query += ` AND type = $${paramIndex}`;
    queryParams.push(type);
    paramIndex++;
  }

  if (status) {
    query += ` AND status = $${paramIndex}`;
    queryParams.push(status);
    paramIndex++;
  }

  // Ordenação
  const validSortBy = ['due_date', 'amount'];
  const validSortOrder = ['asc', 'desc'];
  const finalSortBy = validSortBy.includes(sortBy) ? sortBy : 'due_date';
  const finalSortOrder = validSortOrder.includes(sortOrder) ? sortOrder : 'asc';

  query += ` ORDER BY ${finalSortBy} ${finalSortOrder}`;

  try {
    const queryResult = await pool.query(query, queryParams);
    res.json(queryResult.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Erro no servidor');
  }
};

// @route   GET api/debts/:id
// @desc    Obter uma dívida específica de um usuário
// @access  Private
const getDebtById = async (req, res) => {
  const debtId = req.params.id;
  const userId = req.user.id;

  try {
    const debt = await Debt.getDebtById(debtId, userId);
    if (!debt) {
      return res.status(404).json({ message: 'Dívida não encontrada' });
    }
    res.json(debt);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Erro no servidor');
  }
};

// @route   PUT api/debts/:id
// @desc    Atualizar uma dívida existente
// @access  Private
const updateDebt = async (req, res) => {
  const debtId = req.params.id;
  const { description, amount, due_date, type, status } = req.body;
  const userId = req.user.id;

  try {
    const updatedDebt = await Debt.updateDebt(debtId, userId, description, amount, due_date, type, status);
    if (!updatedDebt) {
      return res.status(404).json({ message: 'Dívida não encontrada' });
    }
    res.json(updatedDebt);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Erro no servidor');
  }
};

// @route   DELETE api/debts/:id
// @desc    Deletar uma dívida
// @access  Private
const deleteDebt = async (req, res) => {
  const debtId = req.params.id;
  const userId = req.user.id;

  try {
    const deletedDebt = await Debt.deleteDebt(debtId, userId);
    if (!deletedDebt) {
      return res.status(404).json({ message: 'Dívida não encontrada' });
    }
    res.json({ message: 'Dívida removida' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Erro no servidor');
  }
};

module.exports = {
  createDebt,
  getDebts,
  getDebtById,
  updateDebt,
  deleteDebt,
};
