<template>
  <div class="register">
    <h1>Registrar</h1>
    <form @submit.prevent="register">
      <div class="form-group">
        <label for="name">Nome:</label>
        <input type="text" id="name" v-model="name" required />
      </div>
      <div class="form-group">
        <label for="email">Email:</label>
        <input type="email" id="email" v-model="email" required />
      </div>
      <div class="form-group">
        <label for="password">Senha:</label>
        <input type="password" id="password" v-model="password" required />
      </div>
      <button type="submit">Registrar</button>
    </form>
    <p v-if="error" class="error-message">{{ error }}</p>
  </div>
</template>

<script>

export default {
  name: 'RegisterView',
  data() {
    return {
      name: '',
      email: '',
      password: '',
      error: null,
    };
  },
  methods: {
    async register() {
      this.error = null;
      try {
        const res = await this.$axios.post('/auth/register', {
          name: this.name,
          email: this.email,
          password: this.password,
        });
        console.log('Registro bem-sucedido!', res.data);
        this.$router.push('/login');
      } catch (err) {
        this.error = err.response && err.response.data && err.response.data.message
          ? err.response.data.message
          : 'Erro no registro. Tente novamente.';
        console.error('Erro de registro:', err);
      }
    },
  },
};
</script>

<style scoped>
.register {
  max-width: 400px;
  margin: 50px auto;
  padding: 20px;
  border: 1px solid var(--border-color);
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  background-color: var(--card-background);
  color: var(--text-color);
}

.form-group {
  margin-bottom: 15px;
}

label {
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
  color: var(--text-color);
}

input[type='text'],
input[type='email'],
input[type='password'] {
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
  transition: background-color 0.3s ease;
}

button:hover {
  background-color: var(--button-hover-color);
}

.error-message {
  color: var(--error-color);
  margin-top: 10px;
}
</style>
