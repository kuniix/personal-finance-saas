<script>
export default {
  name: 'App',
  data() {
    return {
      isLoggedIn: false,
      isDarkMode: false,
    };
  },
  created() {
    this.checkLoginStatus();
    this.loadDarkModePreference();
    window.addEventListener('storage', this.checkLoginStatus);
    this.$router.afterEach(() => {
      this.checkLoginStatus();
    });
  },
  unmounted() {
    window.removeEventListener('storage', this.checkLoginStatus);
  },
  methods: {
    checkLoginStatus() {
      this.isLoggedIn = !!localStorage.getItem('token');
    },
    handleLogout() {
      localStorage.removeItem('token');
      this.isLoggedIn = false;
      this.$router.push('/login');
    },
    loadDarkModePreference() {
      const prefersDarkMode = localStorage.getItem('darkMode');
      if (prefersDarkMode !== null) {
        this.isDarkMode = JSON.parse(prefersDarkMode);
      } else {
        // Detectar preferência do sistema operacional
        this.isDarkMode = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
      }
      this.applyDarkModeClass();
    },
    toggleDarkMode() {
      this.isDarkMode = !this.isDarkMode;
      localStorage.setItem('darkMode', JSON.stringify(this.isDarkMode));
      this.applyDarkModeClass();
    },
    applyDarkModeClass() {
      if (this.isDarkMode) {
        document.documentElement.classList.add('dark-mode');
      } else {
        document.documentElement.classList.remove('dark-mode');
      }
    },
  },
};
</script>

<template>
  <div id="app">
    <nav>
      <router-link to="/dashboard">Início</router-link> |
      <router-link to="/transactions">Transações</router-link> |
      <router-link to="/debts">Dívidas</router-link> |
      <router-link to="/categories">Categorias</router-link> |
      <router-link to="/profile">Perfil</router-link> |
      <router-link to="/reports">Relatórios</router-link> |
      <template v-if="isLoggedIn">
        <a href="#" @click.prevent="handleLogout">Logout</a>
      </template>
      <template v-else>
        <router-link to="/register">Registrar</router-link> |
        <router-link to="/login">Login</router-link>
      </template>
      <button @click="toggleDarkMode" class="dark-mode-toggle">
        {{ isDarkMode ? 'Modo Claro' : 'Modo Escuro' }}
      </button>
    </nav>
    <router-view />
  </div>
</template>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  /* Removido color: #2c3e50; e margin-top: 60px; pois serão tratados pelo theme.css ou estilos específicos */
}

nav {
  margin-bottom: 20px;
  display: flex;
  justify-content: center;
  align-items: center; /* Para alinhar o botão de toggle */
  flex-wrap: wrap; /* Para garantir que os itens se ajustem em telas menores */
}

nav a,
nav a.router-link-exact-active {
  font-weight: bold;
  color: var(--text-color); /* Usa a variável de tema */
  margin: 0 10px;
  text-decoration: none;
  transition: color 0.3s ease; /* Transição suave para mudança de cor do texto */
}

nav a.router-link-exact-active {
  color: var(--primary-color); /* Cor de destaque para o link ativo */
}

.dark-mode-toggle {
  background-color: var(--secondary-color);
  color: var(--text-color);
  padding: 5px 10px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  margin-left: 20px; /* Espaçamento do restante dos links */
  transition: background-color 0.3s ease, color 0.3s ease;
}

.dark-mode-toggle:hover {
  opacity: 0.9;
}
</style>
