const Category = require('../models/Category');

// @route   POST api/categories
// @desc    Criar uma nova categoria
// @access  Private
const createCategory = async (req, res) => {
  const { name, type } = req.body;
  const userId = req.user.id;

  try {
    const newCategory = await Category.createCategory(userId, name, type);
    res.status(201).json(newCategory);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Erro no servidor');
  }
};

// @route   GET api/categories
// @desc    Obter todas as categorias de um usuário
// @access  Private
const getCategories = async (req, res) => {
  const userId = req.user.id;

  try {
    const categories = await Category.getCategoriesByUserId(userId);
    res.json(categories);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Erro no servidor');
  }
};

// @route   GET api/categories/:id
// @desc    Obter uma categoria específica de um usuário
// @access  Private
const getCategoryById = async (req, res) => {
  const categoryId = req.params.id;
  const userId = req.user.id;

  try {
    const category = await Category.getCategoryById(categoryId, userId);
    if (!category) {
      return res.status(404).json({ message: 'Categoria não encontrada' });
    }
    res.json(category);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Erro no servidor');
  }
};

// @route   PUT api/categories/:id
// @desc    Atualizar uma categoria existente
// @access  Private
const updateCategory = async (req, res) => {
  const categoryId = req.params.id;
  const { name, type } = req.body;
  const userId = req.user.id;

  try {
    const updatedCategory = await Category.updateCategory(categoryId, userId, name, type);
    if (!updatedCategory) {
      return res.status(404).json({ message: 'Categoria não encontrada' });
    }
    res.json(updatedCategory);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Erro no servidor');
  }
};

// @route   DELETE api/categories/:id
// @desc    Deletar uma categoria
// @access  Private
const deleteCategory = async (req, res) => {
  const categoryId = req.params.id;
  const userId = req.user.id;

  try {
    const deletedCategory = await Category.deleteCategory(categoryId, userId);
    if (!deletedCategory) {
      return res.status(404).json({ message: 'Categoria não encontrada' });
    }
    res.json({ message: 'Categoria removida' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Erro no servidor');
  }
};

module.exports = {
  createCategory,
  getCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
};
