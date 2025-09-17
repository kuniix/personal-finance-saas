const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth'); // Importa o middleware de autenticação
const debtController = require('../controllers/debtController');

// @route   POST api/debts
// @desc    Criar uma nova dívida
// @access  Private
router.post('/', auth, debtController.createDebt);

// @route   GET api/debts
// @desc    Obter todas as dívidas de um usuário
// @access  Private
router.get('/', auth, debtController.getDebts);

// @route   GET api/debts/:id
// @desc    Obter uma dívida específica de um usuário
// @access  Private
router.get('/:id', auth, debtController.getDebtById);

// @route   PUT api/debts/:id
// @desc    Atualizar uma dívida existente
// @access  Private
router.put('/:id', auth, debtController.updateDebt);

// @route   DELETE api/debts/:id
// @desc    Deletar uma dívida
// @access  Private
router.delete('/:id', auth, debtController.deleteDebt);

module.exports = router;
