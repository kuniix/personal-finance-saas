const Report = require('../models/Report');

const getCategoryReport = async (req, res) => {
  try {
    const userId = req.user.id;
    const report = await Report.getSummaryByCategory(userId);
    res.json(report);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Erro do Servidor');
  }
};

const getTimePeriodReport = async (req, res) => {
  try {
    const userId = req.user.id;
    const { startDate, endDate } = req.query;

    if (!startDate || !endDate) {
      return res.status(400).json({ msg: 'Por favor, forneça as datas de início e fim.' });
    }

    const report = await Report.getSummaryByTimePeriod(userId, startDate, endDate);
    res.json(report);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Erro do Servidor');
  }
};

module.exports = {
  getCategoryReport,
  getTimePeriodReport,
};
