const { verifyToken } = require("../helpers");
const { User } = require("../models");

const auth = async (req, res, next) => {
  try {
    const { access_token } = req.headers;

    if (!access_token) {
      throw { name: "InvalidToken" };
    }

    const payload = verifyToken(access_token);

    const user = await User.findByPk(payload.id);

    if (!user) {
      throw { name: "InvalidToken" };
    }
    req.user = { id: user.id, name: user.surename };
    next();
  } catch (err) {
    next(err);
  }
};

module.exports = auth;
