const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth'); // Importa o middleware de autenticação
const profileController = require('../controllers/profileController');

// @route   GET api/profile/me
// @desc    Obter o perfil do usuário logado
// @access  Private
router.get('/me', auth, profileController.getMyProfile);

// @route   PUT api/profile/me
// @desc    Atualizar o perfil do usuário logado
// @access  Private
router.put('/me', auth, profileController.updateMyProfile);

module.exports = router;
