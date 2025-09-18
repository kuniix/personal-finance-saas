import { createRouter, createWebHistory } from 'vue-router'
import RegisterView from '../views/RegisterView.vue'
import LoginView from '../views/LoginView.vue'
import TransactionsView from '../views/TransactionsView.vue' // Importa o componente de listagem de transações
import TransactionForm from '../components/TransactionForm.vue' // Importa o componente de formulário de transação
import DebtsView from '../views/DebtsView.vue' // Importa o componente de listagem de dívidas
import DebtForm from '../components/DebtForm.vue' // Importa o componente de formulário de dívida
import CategoriesView from '../views/CategoriesView.vue' // Importa o componente de listagem de categorias
import CategoryForm from '../components/CategoryForm.vue' // Importa o componente de formulário de categoria
import ProfileView from '../views/ProfileView.vue' // Importa o componente de perfil
import ReportsView from '../views/ReportsView.vue' // Importa o componente de relatórios

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      redirect: '/login' // Redireciona a rota raiz para login
    },
    {
      path: '/register',
      name: 'register',
      component: RegisterView
    },
    {
      path: '/login',
      name: 'login',
      component: LoginView
    },
    {
      path: '/transactions',
      name: 'transactions',
      component: TransactionsView,
      meta: { requiresAuth: true } // Protege esta rota
    },
    {
      path: '/transactions/add',
      name: 'addTransaction',
      component: TransactionForm,
      meta: { requiresAuth: true }
    },
    {
      path: '/transactions/edit/:id',
      name: 'editTransaction',
      component: TransactionForm,
      props: true, // Permite que o ID seja passado como prop
      meta: { requiresAuth: true }
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      // Criar um componente DashboardView futuramente
      component: () => import('../views/DashboardView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/debts',
      name: 'debts',
      component: DebtsView,
      meta: { requiresAuth: true }
    },
    {
      path: '/debts/add',
      name: 'addDebt',
      component: DebtForm,
      meta: { requiresAuth: true }
    },
    {
      path: '/debts/edit/:id',
      name: 'editDebt',
      component: DebtForm,
      props: true,
      meta: { requiresAuth: true }
    },
    {
      path: '/categories',
      name: 'categories',
      component: CategoriesView,
      meta: { requiresAuth: true }
    },
    {
      path: '/categories/add',
      name: 'addCategory',
      component: CategoryForm,
      meta: { requiresAuth: true }
    },
    {
      path: '/categories/edit/:id',
      name: 'editCategory',
      component: CategoryForm,
      props: true,
      meta: { requiresAuth: true }
    },
    {
      path: '/profile',
      name: 'profile',
      component: ProfileView,
      meta: { requiresAuth: true }
    },
    {
      path: '/reports',
      name: 'reports',
      component: ReportsView,
      meta: { requiresAuth: true }
    }
  ]
})

// Adiciona um guarda de navegação global para verificar a autenticação
router.beforeEach((to, from, next) => {
  if (to.meta.requiresAuth && !localStorage.getItem('token')) {
    next('/login');
  } else {
    next();
  }
});

export default router
