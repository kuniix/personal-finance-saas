<template>
  <div class="dashboard">
    <h1>Bem-vindo ao Dashboard!</h1>
    <p>Você está logado.</p>

    <div v-if="loadingSummary">Carregando resumo financeiro...</div>
    <div v-else-if="summaryError" class="error-message">{{ summaryError }}</div>
    <div v-else class="summary-cards">
      <div class="card income-card">
        <h3>Total de Entradas</h3>
        <p>R$ {{ financialSummary.totalIncome.toFixed(2) }}</p>
      </div>
      <div class="card expense-card">
        <h3>Total de Saídas</h3>
        <p>R$ {{ financialSummary.totalExpense.toFixed(2) }}</p>
      </div>
      <div class="card balance-card">
        <h3>Balanço</h3>
        <p>R$ {{ financialSummary.balance.toFixed(2) }}</p>
      </div>
    </div>

    <div class="dashboard-nav">
      <router-link to="/transactions">Ver Transações</router-link>
      <router-link to="/debts">Ver Dívidas</router-link>
    </div>
    <button @click="logout">Sair</button>
  </div>
</template>

<script>

export default {
  name: 'DashboardView',
  data() {
    return {
      financialSummary: {
        totalIncome: 0,
        totalExpense: 0,
        balance: 0,
      },
      loadingSummary: false,
      summaryError: null,
    };
  },
  async created() {
    await this.fetchFinancialSummary();
  },
  methods: {
    async fetchFinancialSummary() {
      this.loadingSummary = true;
      this.summaryError = null;
      try {
        const res = await this.$axios.get('/transactions/summary');
        this.financialSummary = res.data;
      } catch (err) {
        console.error('Erro ao buscar resumo financeiro:', err);
        this.summaryError = 'Falha ao carregar resumo financeiro.';
        if (err.response && (err.response.status === 401 || err.response.status === 403)) {
          this.$router.push('/login');
        }
      } finally {
        this.loadingSummary = false;
      }
    },
    logout() {
      localStorage.removeItem('token');
      this.$router.push('/login');
    },
  },
};
</script>

<style scoped>
.dashboard {
  max-width: 800px;
  margin: 50px auto;
  padding: 20px;
  border: 1px solid var(--border-color);
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  text-align: center;
  background-color: var(--card-background);
  color: var(--text-color);
}

.summary-cards {
  display: flex;
  justify-content: space-around;
  margin-top: 30px;
  margin-bottom: 30px;
}

.card {
  flex: 1;
  background-color: var(--input-background);
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  margin: 0 10px;
  color: var(--text-color);
}

.income-card h3 {
  color: var(--primary-color);
}

.expense-card h3 {
  color: var(--error-color);
}

.balance-card h3 {
  color: var(--secondary-color);
}

.card p {
  font-size: 1.5em;
  font-weight: bold;
  margin-top: 10px;
}

.dashboard-nav {
  margin-top: 20px;
  margin-bottom: 20px;
}

.dashboard-nav a {
  margin: 0 10px;
  text-decoration: none;
  color: var(--primary-color);
  font-weight: bold;
  transition: color 0.3s ease;
}

.dashboard-nav a:hover {
  text-decoration: underline;
}

button {
  background-color: var(--error-color);
  color: var(--card-background);
  padding: 10px 15px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
  margin-top: 20px;
  transition: background-color 0.3s ease;
}

button:hover {
  background-color: #d32f2f; /* Manter um tom mais escuro de vermelho para hover */
}

.error-message {
  color: var(--error-color);
  margin-top: 15px;
}
</style>
