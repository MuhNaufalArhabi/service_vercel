const { User, Account, Category, sequelize } = require("../models");
const { comparePass, encode } = require("../helpers");
const { OAuth2Client } = require('google-auth-library');

class UserController {
  static async register(req, res, next) {
    const t = await sequelize.transaction();
    try {
      const { surename, password, email} = req.body;
      const user = await User.create({ surename, password, email }, { transaction: t});

      const accounts = require("../data/data.json").accounts.map((el) => {
        el.UserId = user.id;
        return el;
      });
      const categories = require("../data/data.json").categories.map((el) => {
        el.UserId = user.id;
        return el
      });
      await Account.bulkCreate(accounts, { transaction: t});
      await Category.bulkCreate(categories, { transaction: t});

      await t.commit()

      res.status(201).json({ message: "Succes create User" });
    } catch (err) {
      await t.rollback()
      next(err);
    }
  }

  static async login(req, res, next) {
    try {
      const { email, password } = req.body;
      const user = await User.findOne({ where: { email } });
      if (!user) {
        throw { name: "InvalidLogin" };
      }
      if (!comparePass(password, user.password)) {
        throw { name: "InvalidLogin" };
      }
      const access_token = encode({ id: user.id});
      res.status(200).json({ access_token , username: user.surename});
    } catch (err) {
      next(err);
    }
  }

  static async gSign(req, res, next) {
    const t = await sequelize.transaction()
    try {
      const google_token = req.headers.google_token;
      const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
      const ticket = await client.verifyIdToken({
        idToken: google_token,
        audience: process.env.GOOGLE_CLIENT_ID, // Specify the CLIENT_ID of the app that accesses the backend
        // Or, if multiple clients access the backend:
        //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
      });
      const payload = ticket.getPayload();
      console.log(payload)
      const [user, create] = await User.findOrCreate({
        where: {
          email: payload.email,
        },
        defaults: {
          email: payload.email,
          surename: payload.name,
          password: 'sign-in-google',
        },
        hooks: false,
        transaction: t
      });

      if(create){
      const accounts = require("../data/data.json").accounts.map((el) => {
        el.UserId = user.id;
        return el;
      });
      const categories = require("../data/data.json").categories.map((el) => {
        el.UserId = user.id;
        return el
      });
        await Account.bulkCreate(accounts, { transaction: t});
        await Category.bulkCreate(categories, { transaction: t});
      }

      await t.commit()

      const access_token = encode({ id: user.id});
      res.status(200).json({ access_token, username: user.surename });
    } catch (error) {
      await t.rollback()
      next(error);
    }
  }
}


module.exports = UserController;
