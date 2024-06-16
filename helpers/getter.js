const { Account } = require("../models");

const returnSaldo = async (data) => {
  switch (data.status) {
    case "income":
      const accountInco = await Account.findByPk(data.AccountId);
      await Account.update(
        { saldo: accountInco.saldo - data.saldo },
        { where: { id: accountInco.id } }
      );
      break;
    case "spending":
      const accountSpen = await Account.findByPk(data.AccountId);
      await Account.update(
        { saldo: accountSpen.saldo + data.saldo },
        { where: { id: accountSpen.id } }
      );

      break;

    default:
      break;
  }
};

module.exports = returnSaldo