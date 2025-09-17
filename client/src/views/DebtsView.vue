<template>
  <div class="debts-view">
    <h1>Minhas Dívidas</h1>

    <div class="filters-sort-controls">
      <div class="filter-group">
        <label for="type-filter">Tipo:</label>
        <select id="type-filter" v-model="filters.type" @change="fetchDebts">
          <option value="">Todos</option>
          <option value="recurring">Recorrente</option>
          <option value="seasonal">Sazonal</option>
        </select>
      </div>

      <div class="filter-group">
        <label for="status-filter">Status:</label>
        <select id="status-filter" v-model="filters.status" @change="fetchDebts">
          <option value="">Todos</option>
          <option value="pending">Pendente</option>
          <option value="paid">Pago</option>
        </select>
      </div>

      <div class="sort-group">
        <label for="sort-by">Ordenar por:</label>
        <select id="sort-by" v-model="sortBy" @change="fetchDebts">
          <option value="due_date">Data de Vencimento</option>
          <option value="amount">Valor</option>
        </select>
        <select id="sort-order" v-model="sortOrder" @change="fetchDebts">
          <option value="desc">Descendente</option>
          <option value="asc">Ascendente</option>
        </select>
      </div>
    </div>

    <router-link to="/debts/add" class="add-button">Adicionar Nova Dívida</router-link>

    <p v-if="message" :class="{ 'success': !error, 'error-message': error }">{{ message }}</p>

    <ul v-if="debts.length > 0" class="debts-list">
      <li v-for="debt in debts" :key="debt.id" class="debt-item">
        <div class="debt-details">
          <span>{{ debt.description }} - R$ {{ parseFloat(debt.amount).toFixed(2) }}</span>
          <span class="debt-info">Vencimento: {{ new Date(debt.due_date).toLocaleDateString() }} | Status: {{ debt.status === 'pending' ? 'Pendente' : 'Pago' }}</span>
        </div>
        <div class="debt-actions">
          <button @click="editDebt(debt.id)" class="edit-button">Editar</button>
          <button @click="deleteDebt(debt.id)" class="delete-button">Excluir</button>
        </div>
      </li>
    </ul>
    <p v-else>Nenhuma dívida encontrada.</p>
  </div>
</template>

<script>

export default {
  name: 'DebtsView',
  data() {
    return {
      debts: [],
      filters: {
        type: '',
        status: '',
      },
      sortBy: 'due_date',
      sortOrder: 'desc',
      message: null,
      error: false,
    };
  },
  async created() {
    await this.fetchDebts();
  },
  methods: {
    async fetchDebts() {
      this.message = null;
      this.error = false;
      try {
        const params = {
          type: this.filters.type,
          status: this.filters.status,
          sortBy: this.sortBy,
          sortOrder: this.sortOrder,
        };
        const res = await this.$axios.get('/debts', { params });
        this.debts = res.data;
      } catch (err) {
        console.error('Erro ao buscar dívidas:', err);
        this.message = 'Falha ao carregar dívidas.';
        this.error = true;
      }
    },
    editDebt(id) {
      this.$router.push(`/debts/edit/${id}`);
    },
    async deleteDebt(id) {
      if (confirm('Tem certeza que deseja excluir esta dívida?')) {
        try {
          await this.$axios.delete(`/debts/${id}`);
          this.message = 'Dívida excluída com sucesso!';
          this.error = false;
          await this.fetchDebts();
        } catch (err) {
          console.error('Erro ao excluir dívida:', err);
          this.message = 'Falha ao excluir dívida.';
          this.error = true;
        }
      }
    },
  },
};
</script>

<style scoped>
.debts-view {
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

.debts-list {
  list-style: none;
  padding: 0;
}

.debt-item {
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

.debt-details {
  flex-grow: 1;
  text-align: left;
  margin-right: 15px;
  color: var(--text-color);
}

.debt-info {
  font-size: 0.9em;
  color: var(--secondary-color);
  margin-left: 10px;
}

.debt-actions button {
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

.debt-actions .edit-button {
  background-color: var(--secondary-color);
  color: var(--card-background);
}

.debt-actions .edit-button:hover {
  background-color: var(--button-hover-color);
}

.debt-actions .delete-button {
  background-color: var(--error-color);
}

.debt-actions .delete-button:hover {
  background-color: #c82333;
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
