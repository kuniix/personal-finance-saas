<template>
  <div class="debt-form">
    <h1>{{ isEditing ? 'Editar Dívida' : 'Adicionar Dívida' }}</h1>
    <form @submit.prevent="saveDebt">
      <div class="form-group">
        <label for="description">Descrição:</label>
        <input type="text" id="description" v-model="debt.description" required />
      </div>
      <div class="form-group">
        <label for="amount">Valor:</label>
        <input type="number" id="amount" v-model="debt.amount" required step="0.01" />
      </div>
      <div class="form-group">
        <label for="due_date">Data de Vencimento:</label>
        <input type="date" id="due_date" v-model="debt.due_date" required />
      </div>
      <div class="form-group">
        <label for="type">Tipo:</label>
        <select id="type" v-model="debt.type" required>
          <option value="recurring">Recorrente</option>
          <option value="seasonal">Sazonal</option>
        </select>
      </div>
      <div class="form-group">
        <label for="status">Status:</label>
        <select id="status" v-model="debt.status" required>
          <option value="pending">Pendente</option>
          <option value="paid">Paga</option>
        </select>
      </div>
      <button type="submit">Salvar</button>
    </form>
    <p v-if="message" :class="{ 'success': !error, 'error-message': error }">{{ message }}</p>
  </div>
</template>

<script>

export default {
  name: 'DebtForm',
  props: {
    id: { type: String, default: null },
  },
  data() {
    return {
      debt: {
        description: '',
        amount: 0,
        due_date: new Date().toISOString().split('T')[0],
        type: 'recurring',
        status: 'pending',
      },
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
    if (this.isEditing) {
      await this.fetchDebt();
    }
  },
  methods: {
    async fetchDebt() {
      try {
        const res = await this.$axios.get(`/debts/${this.id}`);
        this.debt = {
          ...res.data,
          due_date: new Date(res.data.due_date).toISOString().split('T')[0],
        };
      } catch (err) {
        console.error('Erro ao buscar dívida:', err);
        this.message = 'Falha ao carregar dívida para edição.';
        this.error = true;
      }
    },
    async saveDebt() {
      this.message = null;
      this.error = false;
      try {
        const debtData = {
          ...this.debt,
          amount: parseFloat(this.debt.amount),
        };
        if (this.isEditing) {
          await this.$axios.put(`/debts/${this.id}`, debtData);
          this.message = 'Dívida atualizada com sucesso!';
        } else {
          await this.$axios.post('/debts', debtData);
          this.message = 'Dívida adicionada com sucesso!';
        }
        this.$router.push('/debts');
      } catch (err) {
        console.error('Erro ao salvar dívida:', err);
        this.message = err.response && err.response.data && err.response.data.message
          ? err.response.data.message
          : 'Erro ao salvar dívida. Tente novamente.';
        this.error = true;
      }
    },
  },
};
</script>

<style scoped>
.debt-form {
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
