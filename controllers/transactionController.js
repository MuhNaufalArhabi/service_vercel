const { Transaction, sequelize, Account } = require("../models");
const returnSaldo = require("../helpers/getter");

class TransactionController {
  static async getAll(req, res, next) {
    try {
      const {date} = req.query
      const month = date.split('-')[1][0] === '0'? date.split('-')[1][1]: date.split('-')[1][0]  
      const year = date.split('-')[0]
      console.log(month, year)
      const trans = await sequelize.query(`
      SELECT
      a.date, json_agg(a)
    FROM
      (
        SELECT      t.id,
          t.title,
          t.saldo,
          t."date",
          t.status,
          t."AccountId",
          t."CategoryId",
          t."UserId",
          t."createdAt",
          t."updatedAt",
          c."name" as "category"
        FROM
          public."Transactions" t
        JOIN "Categories" c ON t."CategoryId" = c.id 
        WHERE t."UserId" = :userId 
        AND EXTRACT(MONTH FROM t.date) = :month
        AND EXTRACT(YEAR FROM t.date) = :year
        ORDER BY t.date DESC
      ) a
    GROUP BY
      a.date
    ORDER BY
      a.date DESC
    `, {
      replacements: { userId: req.user.id, month, year},
      type: sequelize.QueryTypes.SELECT
    });
      const temp = trans;
      for (let i in temp) {
        temp[i].date = temp[i].date.toLocaleString().split(',')[0]
      }
      res.status(200).json( temp );
    } catch (err) {
      next(err);
    }
  }

  static async getById(req, res, next) {
    try {
      const trans = await Transaction.findByPk(req.params.id);
      if (!trans) {
        throw { name: "NotFound" };
      }
      res.status(200).json(trans);
    } catch (err) {
      next(err);
    }
  }

  static async create(req, res, next) {
    const t = await sequelize.transaction();
    try {
      const { title, saldo, date, status, AccountId, CategoryId } = req.body;
      const trans = await Transaction.create({
        title,
        saldo: +saldo,
        date,
        status,
        AccountId,
        CategoryId,
        UserId: req.user.id,
      },{transaction: t});
      switch (status) {
        case "income":
          const accountInco = await Account.findByPk(AccountId);
          await Account.update(
            { saldo: accountInco.saldo + trans.saldo },
            { where: { id: AccountId }, transaction: t }
          );
          break;
        case "spending":
          const accountSpen = await Account.findByPk(AccountId);
          await Account.update(
            { saldo: accountSpen.saldo - trans.saldo },
            { where: { id: AccountId }, transaction: t }
          );
          break;
        default:
          break;
      }
      await t.commit();
      res.status(201).json(trans);
    } catch (err) {
      await t.rollback();
      next(err);
    }
  }

  static async update(req, res, next) {
    const t = await sequelize.transaction();
    try {
      const id = req.params.id;
      const data = await Transaction.findByPk(id);

      if (!data) {
        throw { name: "NotFound" };
      }

      returnSaldo(data);

      const { title, saldo, date, status, AccountId, CategoryId } = req.body;
      const trans = await Transaction.update(
        { title, saldo, date, status, AccountId, CategoryId, UserId: req.user.findByPk },
        { where: { id }, transaction: t }
      );
      switch (status) {
        case "income":
          const accountInco = await Account.findByPk(AccountId);
          await Account.update(
            { saldo: accountInco.saldo + saldo },
            { where: { id: AccountId }, transaction: t }
          );
          break;
        case "spending":
          const accountSpen = await Account.findByPk(AccountId);
          await Account.update(
            { saldo: accountSpen.saldo - saldo },
            { where: { id: AccountId }, transaction: t }
          );
          break;
        default:
          break;
      }
      await t.commit();
      res.status(201).json({ message: "Succes updeted transaction" });
    } catch (err) {
      await t.rollback();
      next(err);
    }
  }

  static async delete(req, res, next) {
    try {
      const id = req.params.id;
      const data = await Transaction.findByPk(id);

      if (!data) {
        throw { name: "NotFound" };
      }

      await returnSaldo(data);

      await Transaction.destroy({ where: { id } });
      res.status(200).json({ message: "Succes deleted transaction" });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = TransactionController;
