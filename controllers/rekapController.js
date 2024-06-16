const { sequelize } = require("../models");

class RekapController {
  static async getRekap(req, res, next) {
    try {
      const rekap = await sequelize.query(`
      SELECT c.MONTH,c.month_start, c.month_end, c."UserId", c.income::integer, c.spending::integer, c.saldo_awal, c.selisih, c.selisih + c."saldo_awal" AS saldo_akhir
      FROM 
      (
      SELECT
          a.*,
          a.income - a.spending AS selisih,
          CASE
              WHEN a.ROW = 1 THEN 0
              WHEN a.ROW != 1 THEN 
              (
              SELECT
                  b.income - b.spending AS "saldo_awal"
              FROM
                  (
                  SELECT
                      date_trunc('month', t.date)::date || ' - ' || (date_trunc('month', t.date) + INTERVAL '1 month' - INTERVAL '1 day')::date AS MONTH,
                      t."UserId",
                      sum(CASE WHEN t.status = 'income' THEN t.saldo ELSE 0 END) AS income,
                      sum(CASE WHEN t.status = 'spending' THEN t.saldo ELSE 0 END) AS spending,
                      ROW_NUMBER() OVER (PARTITION BY t."UserId"
                  ORDER BY
                      date_trunc('month', t.date)) AS ROW
                  FROM
                      "Transactions" t
                  WHERE
                      t."UserId" = :userId
                  GROUP BY
                      date_trunc('month', t.date),
                      t."UserId"
                  ORDER BY
                      date_trunc('month', t.date) DESC) b
                      WHERE b.ROW = a.ROW - 1
                      ) END AS saldo_awal
          FROM
              (
              SELECT
                  date_trunc('month', t.date)::date || ' - ' || (date_trunc('month', t.date) + INTERVAL '1 month' - INTERVAL '1 day')::date AS MONTH,
                  t."UserId",
                  sum(CASE WHEN t.status = 'income' THEN t.saldo ELSE 0 END) AS income,
                  sum(CASE WHEN t.status = 'spending' THEN t.saldo ELSE 0 END) AS spending,
                  date_trunc('month', t.date)::date AS month_start,
                  (date_trunc('month', t.date) + INTERVAL '1 month' - INTERVAL '1 day')::date AS month_end,
                  ROW_NUMBER() OVER (PARTITION BY t."UserId"
              ORDER BY
                  date_trunc('month', t.date)) AS ROW
              FROM
                  "Transactions" t
              WHERE
                  t."UserId" = :userId
              GROUP BY
                  date_trunc('month', t.date),
                  t."UserId"
              ORDER BY
                  date_trunc('month', t.date) DESC
      )a
      )c
            `, {
                replacements: { userId: req.user.id},
                type: sequelize.QueryTypes.SELECT
              });
      res.status(200).json(rekap);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = RekapController;
