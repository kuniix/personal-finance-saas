require('dotenv').config();
const express = require('express');
const app = express();
const pool = require('./config/db');
const cors = require('cors'); // Importa o pacote cors

const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(cors()); // Adiciona o middleware CORS

// Definir Rotas
app.use('/api/auth', require('./routes/auth')); // Descomentado
app.use('/api/transactions', require('./routes/transactions')); // Descomentado
app.use('/api/debts', require('./routes/debts')); // Descomentado
app.use('/api/categories', require('./routes/categories'));
app.use('/api/profile', require('./routes/profile'));
app.use('/api/reports', require('./routes/reports')); // Nova rota para relatórios

app.get('/test-db', async (req, res) => {
  try {
    await pool.query('SELECT 1');
    res.status(200).send('Conexão com o banco de dados bem-sucedida!');
  } catch (error) {
    console.error('Erro ao testar a conexão com o banco de dados:', error);
    res.status(500).send('Falha na conexão com o banco de dados.');
  }
});

app.get('/', (req, res) => {
  res.send('API de Finanças Pessoais está rodando!');
});

app.listen(PORT, () => { 
  console.log(`Servidor rodando na porta ${PORT}`);
});
