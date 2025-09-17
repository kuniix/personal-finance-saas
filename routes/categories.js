const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth'); // Importa o middleware de autenticação
const categoryController = require('../controllers/categoryController');

// @route   POST api/categories
// @desc    Criar uma nova categoria
// @access  Private
router.post('/', auth, categoryController.createCategory);

// @route   GET api/categories
// @desc    Obter todas as categorias de um usuário
// @access  Private
router.get('/', auth, categoryController.getCategories);

// @route   GET api/categories/:id
// @desc    Obter uma categoria específica de um usuário
// @access  Private
router.get('/:id', auth, categoryController.getCategoryById);

// @route   PUT api/categories/:id
// @desc    Atualizar uma categoria existente
// @access  Private
router.put('/:id', auth, categoryController.updateCategory);

// @route   DELETE api/categories/:id
// @desc    Deletar uma categoria
// @access  Private
router.delete('/:id', auth, categoryController.deleteCategory);

module.exports = router;
