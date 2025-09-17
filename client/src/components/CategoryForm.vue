<template>
  <div class="category-form">
    <h1>{{ isEditing ? 'Editar Categoria' : 'Adicionar Nova Categoria' }}</h1>
    <form @submit.prevent="saveCategory">
      <div class="form-group">
        <label for="name">Nome:</label>
        <input type="text" id="name" v-model="category.name" required />
      </div>
      <div class="form-group">
        <label for="type">Tipo:</label>
        <select id="type" v-model="category.type" required>
          <option value="income">Entrada</option>
          <option value="expense">Saída</option>
          <option value="both">Ambos</option>
        </select>
      </div>
      <button type="submit">Salvar</button>
    </form>
    <p v-if="message" :class="{ 'success': !error, 'error-message': error }">{{ message }}</p>
  </div>
</template>

<script>

export default {
  name: 'CategoryForm',
  props: {
    id: { type: String, default: null },
  },
  data() {
    return {
      category: {
        name: '',
        type: 'expense',
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
      await this.fetchCategory();
    }
  },
  methods: {
    async fetchCategory() {
      try {
        const res = await this.$axios.get(`/categories/${this.id}`);
        this.category = res.data;
      } catch (err) {
        console.error('Erro ao buscar categoria:', err);
        this.message = 'Falha ao carregar categoria para edição.';
        this.error = true;
      }
    },
    async saveCategory() {
      this.message = null;
      this.error = false;
      try {
        if (this.isEditing) {
          await this.$axios.put(`/categories/${this.id}`, this.category);
          this.message = 'Categoria atualizada com sucesso!';
        } else {
          await this.$axios.post('/categories', this.category);
          this.message = 'Categoria adicionada com sucesso!';
          this.category = { name: '', type: 'expense' };
        }
        this.$router.push('/categories');
      } catch (err) {
        console.error('Erro ao salvar categoria:', err);
        this.message = err.response && err.response.data && err.response.data.message
          ? err.response.data.message
          : 'Erro ao salvar categoria. Tente novamente.';
        this.error = true;
      }
    },
  },
};
</script>

<style scoped>
.category-form {
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

