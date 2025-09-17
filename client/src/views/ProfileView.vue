<template>
  <div class="profile-view">
    <h1>Meu Perfil</h1>
    <form @submit.prevent="updateProfile">
      <div class="form-group">
        <label for="name">Nome:</label>
        <input type="text" id="name" v-model="user.name" required />
      </div>
      <div class="form-group">
        <label for="email">Email:</label>
        <input type="email" id="email" v-model="user.email" required />
      </div>
      <button type="submit">Atualizar Perfil</button>
    </form>
    <p v-if="message" :class="{ 'success': !error, 'error-message': error }">{{ message }}</p>
  </div>
</template>

<script>

export default {
  name: 'ProfileView',
  data() {
    return {
      user: {
        name: '',
        email: '',
      },
      message: null,
      error: false,
    };
  },
  async created() {
    await this.fetchProfile();
  },
  methods: {
    async fetchProfile() {
      this.message = null;
      this.error = false;
      try {
        const res = await this.$axios.get('/profile/me');
        this.user = res.data;
      } catch (err) {
        console.error('Erro ao buscar perfil:', err);
        this.message = 'Falha ao carregar perfil.';
        this.error = true;
        if (err.response && (err.response.status === 401 || err.response.status === 403)) {
          this.$router.push('/login');
        }
      }
    },
    async updateProfile() {
      this.message = null;
      this.error = false;
      try {
        await this.$axios.put('/profile/me', this.user);
        this.message = 'Perfil atualizado com sucesso!';
      } catch (err) {
        console.error('Erro ao atualizar perfil:', err);
        this.message = err.response && err.response.data && err.response.data.message
          ? err.response.data.message
          : 'Erro ao atualizar perfil. Tente novamente.';
        this.error = true;
        if (err.response && (err.response.status === 401 || err.response.status === 403)) {
          this.$router.push('/login');
        }
      }
    },
  },
};
</script>

<style scoped>
.profile-view {
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
input[type='email'] {
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
