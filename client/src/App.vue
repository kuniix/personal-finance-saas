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
        <svg v-if="isDarkMode" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-moon"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>
        <svg v-else xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-sun"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>
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
  background-color: transparent;
  border: none;
  cursor: pointer;
  margin-left: 20px;
  padding: 5px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--text-color); /* Cor do ícone */
  transition: color 0.3s ease;
}

.dark-mode-toggle:hover {
  opacity: 0.7;
  color: var(--primary-color); /* Manter a cor primária no hover se desejar um efeito sutil junto com a opacidade */
}

.dark-mode-toggle svg {
  width: 24px;
  height: 24px;
}
</style>