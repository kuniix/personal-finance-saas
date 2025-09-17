const User = require('../models/User');

// @route   GET api/profile/me
// @desc    Obter o perfil do usuário logado
// @access  Private
const getMyProfile = async (req, res) => {
  const userId = req.user.id;

  try {
    const user = await User.findUserById(userId);
    if (!user) {
      return res.status(404).json({ message: 'Usuário não encontrado' });
    }
    // Não retornar a senha
    const { password, ...profile } = user;
    res.json(profile);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Erro no servidor');
  }
};

// @route   PUT api/profile/me
// @desc    Atualizar o perfil do usuário logado
// @access  Private
const updateMyProfile = async (req, res) => {
  const userId = req.user.id;
  const { name, email } = req.body; // Por enquanto, apenas nome e email

  try {
    const updatedUser = await User.updateUser(userId, name, email);
    if (!updatedUser) {
      return res.status(404).json({ message: 'Usuário não encontrado' });
    }
    // Não retornar a senha
    const { password, ...profile } = updatedUser;
    res.json(profile);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Erro no servidor');
  }
};

module.exports = {
  getMyProfile,
  updateMyProfile,
};
