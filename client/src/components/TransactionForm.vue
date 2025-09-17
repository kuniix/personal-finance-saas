<template>
  <div class="transaction-form">
    <h1>{{ isEditing ? 'Editar' : 'Adicionar' }} Transação</h1>
    <form @submit.prevent="saveTransaction">
      <div class="form-group">
        <label for="description">Descrição:</label>
        <input type="text" id="description" v-model="transaction.description" required />
      </div>
      <div class="form-group">
        <label for="amount">Valor:</label>
        <input type="number" id="amount" v-model="transaction.amount" required step="0.01" />
      </div>
      <div class="form-group">
        <label for="type">Tipo:</label>
        <select id="type" v-model="transaction.type" @change="filterCategoriesByType" required>
          <option value="income">Entrada</option>
          <option value="expense">Saída</option>
        </select>
      </div>
      <div class="form-group">
        <label for="category">Categoria:</label>
        <select id="category" v-model="transaction.category_id">
          <option value="">Selecionar Categoria</option>
          <option v-for="category in filteredCategories" :key="category.id" :value="category.id">
            {{ category.name }}
          </option>
        </select>
      </div>
      <div class="form-group">
        <label for="date">Data:</label>
        <input type="date" id="date" v-model="transaction.date" required />
      </div>
      <button type="submit">Salvar</button>
    </form>
    <p v-if="message" :class="{ 'success': !error, 'error-message': error }">{{ message }}</p>
  </div>
</template>

<script>

export default {
  name: 'TransactionForm',
  props: {
    id: { type: String, default: null },
  },
  data() {
    return {
      transaction: {
        description: '',
        amount: 0,
        type: 'expense',
        category_id: '',
        date: new Date().toISOString().split('T')[0],
      },
      categories: [],
      filteredCategories: [],
      message: null,
      error: false,
    };
  },
  computed: {
    isEditing() {
      return !!this.id;
    },
  },
  async created() {
    await this.fetchCategories();
    if (this.isEditing) {
      await this.fetchTransaction();
    }
  },
  methods: {
    async fetchCategories() {
      try {
        const res = await this.$axios.get('/categories');
        this.categories = res.data;
        this.filterCategoriesByType();
      } catch (err) {
        console.error('Erro ao buscar categorias:', err);
      }
    },
    filterCategoriesByType() {
      this.filteredCategories = this.categories.filter(
        (cat) => cat.type === this.transaction.type || cat.type === 'both'
      );
      // Se a categoria selecionada não for do tipo atual, resetar
      if (
        this.transaction.category_id &&
        !this.filteredCategories.some((c) => c.id === this.transaction.category_id)
      ) {
        this.transaction.category_id = '';
      }
    },
    async fetchTransaction() {
      try {
        const res = await this.$axios.get(`/transactions/${this.id}`);
        this.transaction = {
          ...res.data,
          date: new Date(res.data.date).toISOString().split('T')[0],
        };
        this.filterCategoriesByType();
      } catch (err) {
        console.error('Erro ao buscar transação:', err);
        this.message = 'Falha ao carregar transação para edição.';
        this.error = true;
      }
    },
    async saveTransaction() {
      this.message = null;
      this.error = false;
      try {
        const transactionData = {
          ...this.transaction,
          amount: parseFloat(this.transaction.amount),
        };
        if (this.isEditing) {
          await this.$axios.put(`/transactions/${this.id}`, transactionData);
          this.message = 'Transação atualizada com sucesso!';
        } else {
          await this.$axios.post('/transactions', transactionData);
          this.message = 'Transação adicionada com sucesso!';
          this.resetForm();
        }
        this.$router.push('/transactions');
      } catch (err) {
        console.error('Erro ao salvar transação:', err);
        this.message = err.response && err.response.data && err.response.data.message
          ? err.response.data.message
          : 'Erro ao salvar transação. Tente novamente.';
        this.error = true;
      }
    },
    resetForm() {
      this.transaction = {
        description: '',
        amount: 0,
        type: 'expense',
        category_id: '',
        date: new Date().toISOString().split('T')[0],
      };
      this.filterCategoriesByType();
    },
  },
};
</script>

<style scoped>
.transaction-form {
  max-width: 500px;
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

.form-group {
  margin-bottom: 15px;
  text-align: left;
}

label {
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
  color: var(--text-color);
}

input[type='text'],
input[type='number'],
input[type='date'],
select {
  width: 100%;
  padding: 10px;
  border: 1px solid var(--input-border);
  border-radius: 4px;
  box-sizing: border-box;
  background-color: var(--input-background);
  color: var(--text-color);
}

button {
  background-color: var(--primary-color);
  color: var(--card-background);
  padding: 10px 15px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
  margin-top: 15px;
  transition: background-color 0.3s ease;
}

button:hover {
  opacity: 0.9;
}

.success {
  color: var(--success-color);
  margin-top: 15px;
}

.error-message {
  color: var(--error-color);
  margin-top: 15px;
}
</style>
