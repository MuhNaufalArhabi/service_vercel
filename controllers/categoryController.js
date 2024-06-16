const { Category } = require("../models");

class CategoryController {
  static async getAll(req, res, next) {
    try {
      const category = await Category.findAll({ where: { UserId: req.user.id } });
      res.status(200).json(category);
    } catch (err) {
      next(err);
    }
  }

  static async getById(req, res, next) {
    try {
      const category = await Category.findByPk(req.params.id);
      if (!category) {
        throw { name: "NotFound" };
      }
      res.status(200).json(category);
    } catch (err) {
      next(err);
    }
  }

  static async create(req, res, next) {
    try {
      const { name, status } = req.body;
      await Category.create({ name, status, UserId: req.user.id });
      res.status(201).json({ message: "Succes create category" });
    } catch (err) {
      next(err);
    }
  }

  static async update(req, res, next) {
    try {
      const { name, status } = req.body;
      const id = req.params.id;
      const category = await Category.findByPk(id);
      if (!category) {
        throw { name: "NotFound" };
      }
      await Category.update({ name, status, UserId: req.user.id }, { where: { id } });
      res.status(201).json({ message: "Succes update category" });
    } catch (err) {
      next(err);
    }
  }

  static async delete(req, res, next) {
    try {
      const id = req.params.id;
      const category = await Category.findByPk(id);
      if (!category) {
        throw { name: "NotFound" };
      }
      await Category.destroy({ where: { id } });
      res.status(200).json({ message: "Succes deleted category" });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = CategoryController
