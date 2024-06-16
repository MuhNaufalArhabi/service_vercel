const { Account } = require("../models");

class AccountController {
  static async getAll(req, res, next) {
    try {
      const account = await Account.findAll({
        where: { UserId: req.user.id },
        order: [["id", "asc"]],
      });
      res.status(200).json(account);
    } catch (err) {
      next(err);
    }
  }

  static async getById(req, res, next) {
    try {
      const id = req.params.id;
      const account = await Account.findByPk(id);
      if (!account) {
        throw { name: "NotFound" };
      }
      res.status(200).json(account);
    } catch (err) {
      next(err);
    }
  }

  static async create(req, res, next) {
    try {
      const { name, saldo } = req.body;
      console.log(name, '<<<<<<<<<')
      const account = await Account.create({ name, saldo, UserId: req.user.id });
      res.status(201).json({ message: "Succes create account" });
    } catch (err) {
      next(err);
    }
  }

  static async update(req, res, next) {
    try {
      const { name, saldo } = req.body;
      const account = await Account.update(
        { name, saldo },
        { where: { id: req.params.id } }
      );
      res.status(201).json({ message: "Succes updated account" });
    } catch (err) {
      next(err);
    }
  }

  static async delete(req, res, next) {
    try {
      const account = await Account.findByPk(req.params.id);
      if (!account) {
        throw { name: "NotFound" };
      }
      await Account.destroy({ where: { id: req.params.id } });
      res.status(200).json({ message: "Succes deleted account" });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = AccountController;
