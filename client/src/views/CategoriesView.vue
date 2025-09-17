<template>
  <div class="categories-view">
    <h1>Minhas Categorias</h1>
    <p v-if="categories.length === 0 && !loading">Nenhuma categoria encontrada.</p>
    <div v-else-if="loading">Carregando categorias...</div>
    <ul v-else class="category-list">
      <li v-for="category in categories" :key="category.id">
        <div class="category-details">
          <span class="name">{{ category.name }}</span>
          <span :class="{ 'type-income': category.type === 'income', 'type-expense': category.type === 'expense' }">({{ category.type === 'income' ? 'Entrada' : 'Saída' }})</span>
        </div>
        <div class="category-actions">
          <button @click="editCategory(category.id)">Editar</button>
          <button @click="deleteCategory(category.id)">Excluir</button>
        </div>
      </li>
    </ul>
    <p v-if="error" class="error-message">{{ error }}</p>
    <button @click="$router.push('/categories/add')">Adicionar Nova Categoria</button>
  </div>
</template>

<script>

export default {
  name: 'CategoriesView',
  data() {
    return {
      categories: [],
      loading: false,
      error: null,
    };
  },
  async created() {
    await this.fetchCategories();
  },
  methods: {
    async fetchCategories() {
      this.loading = true;
      this.error = null;
      try {
        const res = await this.$axios.get('/categories');
        this.categories = res.data;
      } catch (err) {
        console.error('Erro ao buscar categorias:', err);
        this.error = 'Falha ao carregar categorias.';
        if (err.response && (err.response.status === 401 || err.response.status === 403)) {
          this.$router.push('/login');
        }
      } finally {
        this.loading = false;
      }
    },
    editCategory(id) {
      this.$router.push(`/categories/edit/${id}`);
    },
    async deleteCategory(id) {
      if (confirm('Tem certeza que deseja excluir esta categoria? Isso também removerá a categoria de quaisquer transações associadas.')) {
        try {
          await this.$axios.delete(`/categories/${id}`);
          this.categories = this.categories.filter(c => c.id !== id);
          console.log(`Categoria ${id} excluída com sucesso.`);
        } catch (err) {
          console.error(`Erro ao excluir categoria ${id}:`, err);
          this.error = 'Falha ao excluir categoria.';
          if (err.response && (err.response.status === 401 || err.response.status === 403)) {
            this.$router.push('/login');
          }
        }
      }
    },
  },
};
</script>

<style scoped>
.categories-view {
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

.category-list {
  list-style: none;
  padding: 0;
  margin-top: 20px;
}

.category-list li {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 0;
  border-bottom: 1px solid var(--border-color);
}

.category-list li:last-child {
  border-bottom: none;
}

.category-details {
  text-align: left;
  color: var(--text-color);
}

.category-details .name {
  font-weight: bold;
  color: var(--text-color);
}

.category-details .type-income {
  color: var(--success-color);
  margin-left: 10px;
  font-size: 0.9em;
}

.category-details .type-expense {
  color: var(--error-color);
  margin-left: 10px;
  font-size: 0.9em;
}

.category-actions button {
  background-color: var(--primary-color);
  color: var(--card-background);
  padding: 5px 10px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.9em;
  margin-left: 5px;
  transition: background-color 0.3s ease;
}

.category-actions button.delete {
  background-color: var(--error-color);
}

.category-actions button:hover {
  opacity: 0.9;
  background-color: var(--button-hover-color);
}

.error-message {
  color: var(--error-color);
  margin-top: 15px;
}
</style>

