const pool = require('../config/db');

const getSummaryByCategory = async (userId) => {
  const queryResult = await pool.query(
    `SELECT
      c.name AS category_name,
      c.type AS category_type,
      SUM(CASE WHEN t.type = 'income' THEN t.amount ELSE 0 END) AS total_income,
      SUM(CASE WHEN t.type = 'expense' THEN t.amount ELSE 0 END) AS total_expense
    FROM
      transactions t
    JOIN
      categories c ON t.category_id = c.id
    WHERE
      t.user_id = $1
    GROUP BY
      c.name, c.type
    ORDER BY
      c.name;
    `,
    [userId]
  );
  return queryResult.rows;
};

const getSummaryByTimePeriod = async (userId, startDate, endDate) => {
  const queryResult = await pool.query(
    `SELECT
      DATE(date) AS report_date,
      SUM(CASE WHEN type = 'income' THEN amount ELSE 0 END) AS total_income,
      SUM(CASE WHEN type = 'expense' THEN amount ELSE 0 END) AS total_expense
    FROM
      transactions
    WHERE
      user_id = $1 AND date BETWEEN $2 AND $3
    GROUP BY
      DATE(date)
    ORDER BY
      DATE(date);
    `,
    [userId, startDate, endDate]
  );
  return queryResult.rows;
};

module.exports = {
  getSummaryByCategory,
  getSummaryByTimePeriod,
};
