const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth'); // Importa o middleware de autenticação
const transactionController = require('../controllers/transactionController');

// @route   GET api/transactions/summary
// @desc    Obter um resumo financeiro
// @access  Private
router.get('/summary', auth, transactionController.getFinancialSummary);

// @route   POST api/transactions
// @desc    Criar uma nova transação
// @access  Private
router.post('/', auth, transactionController.createTransaction);

// @route   GET api/transactions
// @desc    Obter todas as transações de um usuário
// @access  Private
router.get('/', auth, transactionController.getTransactions);

// @route   GET api/transactions/:id
// @desc    Obter uma transação específica de um usuário
// @access  Private
router.get('/:id', auth, transactionController.getTransactionById);

// @route   PUT api/transactions/:id
// @desc    Atualizar uma transação existente
// @access  Private
router.put('/:id', auth, transactionController.updateTransaction);

// @route   DELETE api/transactions/:id
// @desc    Deletar uma transação
// @access  Private
router.delete('/:id', auth, transactionController.deleteTransaction);

module.exports = router;
