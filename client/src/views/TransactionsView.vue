<template>
  <div class="transactions-view">
    <h1>Minhas Transações</h1>

    <div class="filters-sort-controls">
      <div class="filter-group">
        <label for="type-filter">Tipo:</label>
        <select id="type-filter" v-model="filters.type" @change="fetchTransactions">
          <option value="">Todos</option>
          <option value="income">Entrada</option>
          <option value="expense">Saída</option>
        </select>
      </div>

      <div class="filter-group">
        <label for="category-filter">Categoria:</label>
        <select id="category-filter" v-model="filters.category_id" @change="fetchTransactions">
          <option value="">Todas</option>
          <option v-for="category in categories" :key="category.id" :value="category.id">{{ category.name }}</option>
        </select>
      </div>

      <div class="sort-group">
        <label for="sort-by">Ordenar por:</label>
        <select id="sort-by" v-model="sortBy" @change="fetchTransactions">
          <option value="date">Data</option>
          <option value="amount">Valor</option>
        </select>
        <select id="sort-order" v-model="sortOrder" @change="fetchTransactions">
          <option value="desc">Descendente</option>
          <option value="asc">Ascendente</option>
        </select>
      </div>
    </div>

    <router-link to="/transactions/add" class="add-button">Adicionar Nova Transação</router-link>

    <p v-if="message" :class="{ 'success': !error, 'error-message': error }">{{ message }}</p>

    <ul v-if="transactions.length > 0" class="transactions-list">
      <li v-for="transaction in transactions" :key="transaction.id" class="transaction-item">
        <div class="transaction-details">
          <span>{{ transaction.description }} ({{ transaction.category_name || 'N/A' }}) - {{ transaction.type === 'income' ? '+' : '-' }}R$ {{ parseFloat(transaction.amount).toFixed(2) }}</span>
          <span class="transaction-date">{{ new Date(transaction.date).toLocaleDateString() }}</span>
        </div>
        <div class="transaction-actions">
          <button @click="editTransaction(transaction.id)" class="edit-button">Editar</button>
          <button @click="deleteTransaction(transaction.id)" class="delete-button">Excluir</button>
        </div>
      </li>
    </ul>
    <p v-else>Nenhuma transação encontrada.</p>
  </div>
</template>

<script>

export default {
  name: 'TransactionsView',
  data() {
    return {
      transactions: [],
      categories: [],
      filters: {
        type: '',
        category_id: '',
      },
      sortBy: 'date',
      sortOrder: 'desc',
      message: null,
      error: false,
    };
  },
  async created() {
    await this.fetchCategories();
    await this.fetchTransactions();
  },
  methods: {
    async fetchTransactions() {
      this.message = null;
      this.error = false;
      try {
        const params = {
          type: this.filters.type,
          category_id: this.filters.category_id,
          sortBy: this.sortBy,
          sortOrder: this.sortOrder,
        };
        const res = await this.$axios.get('/transactions', { params });
        this.transactions = res.data;
      } catch (err) {
        console.error('Erro ao buscar transações:', err);
        this.message = 'Falha ao carregar transações.';
        this.error = true;
      }
    },
    async fetchCategories() {
      try {
        const res = await this.$axios.get('/categories');
        this.categories = res.data;
      } catch (err) {
        console.error('Erro ao buscar categorias:', err);
      }
    },
    editTransaction(id) {
      this.$router.push(`/transactions/edit/${id}`);
    },
    async deleteTransaction(id) {
      if (confirm('Tem certeza que deseja excluir esta transação?')) {
        try {
          await this.$axios.delete(`/transactions/${id}`);
          this.message = 'Transação excluída com sucesso!';
          this.error = false;
          await this.fetchTransactions();
        } catch (err) {
          console.error('Erro ao excluir transação:', err);
          this.message = 'Falha ao excluir transação.';
          this.error = true;
        }
      }
    },
  },
};
</script>

<style scoped>
.transactions-view {
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

h1 {
  color: var(--text-color);
  margin-bottom: 20px;
}

.filters-sort-controls {
  display: flex;
  justify-content: center;
  gap: 20px;
  margin-bottom: 20px;
  flex-wrap: wrap;
}

.filter-group,
.sort-group {
  display: flex;
  align-items: center;
  gap: 8px;
}

.filter-group label,
.sort-group label {
  color: var(--text-color);
}

.filter-group select,
.sort-group select {
  background-color: var(--input-background);
  color: var(--text-color);
  border: 1px solid var(--input-border);
  padding: 5px;
  border-radius: 4px;
}

.add-button {
  display: inline-block;
  background-color: var(--primary-color);
  color: var(--card-background);
  padding: 10px 15px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
  margin-bottom: 20px;
  text-decoration: none;
  transition: background-color 0.3s ease;
}

.add-button:hover {
  background-color: var(--button-hover-color);
}

.transactions-list {
  list-style: none;
  padding: 0;
}

.transaction-item {
  background-color: var(--input-background);
  border: 1px solid var(--border-color);
  border-radius: 4px;
  margin-bottom: 10px;
  padding: 15px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
}

.transaction-details {
  flex-grow: 1;
  text-align: left;
  margin-right: 15px;
  color: var(--text-color);
}

.transaction-date {
  font-size: 0.9em;
  color: var(--secondary-color);
  margin-left: 10px;
}

.transaction-actions button {
  background-color: var(--primary-color);
  color: var(--card-background);
  padding: 8px 12px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  margin-left: 8px;
  transition: background-color 0.3s ease;
}

.transaction-actions .edit-button {
  background-color: var(--secondary-color);
  color: var(--card-background);
}

.transaction-actions .edit-button:hover {
  background-color: var(--button-hover-color);
}

.transaction-actions .delete-button {
  background-color: var(--error-color);
}

.transaction-actions .delete-button:hover {
  background-color: #c82333; /* Manter um tom mais escuro de vermelho para hover */
}

p.error-message {
  color: var(--error-color);
  margin-top: 10px;
}

p.success {
  color: var(--success-color);
  margin-top: 10px;
}
</style>
