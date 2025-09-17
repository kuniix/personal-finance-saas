<template>
  <div class="reports-view">
    <h1>Relatórios Financeiros</h1>

    <section class="report-section">
      <h2>Resumo por Categoria</h2>
      <button @click="fetchCategoryReport">Gerar Relatório por Categoria</button>
      <p v-if="categoryReportMessage" :class="{ 'success': !categoryReportError, 'error-message': categoryReportError }">{{ categoryReportMessage }}</p>

      <div v-if="categoryReport.length > 0" class="report-table-container">
        <table class="report-table">
          <thead>
            <tr>
              <th>Categoria</th>
              <th>Tipo</th>
              <th>Total de Entradas</th>
              <th>Total de Saídas</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in categoryReport" :key="item.category_name">
              <td>{{ item.category_name }}</td>
              <td>{{ item.category_type === 'income' ? 'Entrada' : item.category_type === 'expense' ? 'Saída' : 'Ambos' }}</td>
              <td :class="{ 'income-amount': true }">R$ {{ parseFloat(item.total_income).toFixed(2) }}</td>
              <td :class="{ 'expense-amount': true }">R$ {{ parseFloat(item.total_expense).toFixed(2) }}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <p v-else-if="!categoryReportMessage">Nenhum dado de relatório por categoria disponível.</p>
    </section>

    <section class="report-section">
      <h2>Resumo por Período de Tempo</h2>
      <div class="date-inputs">
        <label for="startDate">Data de Início:</label>
        <input type="date" id="startDate" v-model="timePeriodFilters.startDate" />
        <label for="endDate">Data de Fim:</label>
        <input type="date" id="endDate" v-model="timePeriodFilters.endDate" />
        <button @click="fetchTimePeriodReport">Gerar Relatório por Período</button>
      </div>
      <p v-if="timePeriodReportMessage" :class="{ 'success': !timePeriodReportError, 'error-message': timePeriodReportError }">{{ timePeriodReportMessage }}</p>

      <div v-if="timePeriodReport.length > 0" class="report-table-container">
        <table class="report-table">
          <thead>
            <tr>
              <th>Data</th>
              <th>Total de Entradas</th>
              <th>Total de Saídas</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in timePeriodReport" :key="item.report_date">
              <td>{{ new Date(item.report_date).toLocaleDateString() }}</td>
              <td :class="{ 'income-amount': true }">R$ {{ parseFloat(item.total_income).toFixed(2) }}</td>
              <td :class="{ 'expense-amount': true }">R$ {{ parseFloat(item.total_expense).toFixed(2) }}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <p v-else-if="!timePeriodReportMessage">Nenhum dado de relatório por período disponível.</p>
    </section>
  </div>
</template>

<script>
export default {
  name: 'ReportsView',
  data() {
    return {
      categoryReport: [],
      categoryReportMessage: null,
      categoryReportError: false,
      timePeriodReport: [],
      timePeriodFilters: {
        startDate: '',
        endDate: '',
      },
      timePeriodReportMessage: null,
      timePeriodReportError: false,
    };
  },
  methods: {
    async fetchCategoryReport() {
      this.categoryReportMessage = null;
      this.categoryReportError = false;
      try {
        const res = await this.$axios.get('/reports/category');
        this.categoryReport = res.data;
        if (this.categoryReport.length === 0) {
          this.categoryReportMessage = 'Nenhum dado de relatório por categoria encontrado.';
        }
      } catch (err) {
        console.error('Erro ao buscar relatório por categoria:', err);
        this.categoryReportMessage = 'Falha ao carregar relatório por categoria.';
        this.categoryReportError = true;
        if (err.response && (err.response.status === 401 || err.response.status === 403)) {
          this.$router.push('/login');
        }
      }
    },
    async fetchTimePeriodReport() {
      this.timePeriodReportMessage = null;
      this.timePeriodReportError = false;
      if (!this.timePeriodFilters.startDate || !this.timePeriodFilters.endDate) {
        this.timePeriodReportMessage = 'Por favor, selecione as datas de início e fim.';
        this.timePeriodReportError = true;
        return;
      }

      try {
        const params = {
          startDate: this.timePeriodFilters.startDate,
          endDate: this.timePeriodFilters.endDate,
        };
        const res = await this.$axios.get('/reports/time-period', { params });
        this.timePeriodReport = res.data;
        if (this.timePeriodReport.length === 0) {
          this.timePeriodReportMessage = 'Nenhum dado de relatório por período encontrado para as datas selecionadas.';
        }
      } catch (err) {
        console.error('Erro ao buscar relatório por período:', err);
        this.timePeriodReportMessage = 'Falha ao carregar relatório por período.';
        this.timePeriodReportError = true;
        if (err.response && (err.response.status === 401 || err.response.status === 403)) {
          this.$router.push('/login');
        }
      }
    },
  },
  created() {
    const today = new Date();
    const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1).toISOString().split('T')[0];
    const lastDayOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).toISOString().split('T')[0];

    this.timePeriodFilters.startDate = firstDayOfMonth;
    this.timePeriodFilters.endDate = lastDayOfMonth;
  },
};
</script>

<style scoped>
.reports-view {
  max-width: 900px;
  margin: 50px auto;
  padding: 20px;
  border: 1px solid #eee;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  text-align: center;
}

h1 {
  color: #2c3e50;
  margin-bottom: 30px;
}

.report-section {
  margin-bottom: 40px;
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 8px;
  background-color: #f9f9f9;
}

h2 {
  color: #34495e;
  margin-bottom: 20px;
}

button {
  background-color: #42b983;
  color: white;
  padding: 10px 15px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
  margin-top: 10px;
  margin-bottom: 20px;
  transition: background-color 0.3s ease;
}

button:hover {
  background-color: #368a68;
}

.date-inputs {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
  margin-bottom: 20px;
}

.date-inputs label {
  font-weight: bold;
  color: #555;
}

.date-inputs input[type="date"] {
  padding: 8px 12px;
  border: 1px solid #ccc;
  border-radius: 5px;
  font-size: 1em;
}

.report-table-container {
  overflow-x: auto;
  margin-top: 20px;
}

.report-table {
  width: 100%;
  border-collapse: collapse;
  margin: 0 auto;
  text-align: left;
}

.report-table th,
.report-table td {
  border: 1px solid #ddd;
  padding: 10px;
}

.report-table th {
  background-color: #f2f2f2;
  font-weight: bold;
  color: #333;
}

.report-table tbody tr:nth-child(even) {
  background-color: #f0f0f0;
}

.income-amount {
  color: green;
  font-weight: bold;
}

.expense-amount {
  color: red;
  font-weight: bold;
}

p.error-message {
  color: red;
  margin-top: 10px;
}

p.success {
  color: green;
  margin-top: 10px;
}
</style>
