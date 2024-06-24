require("dotenv").config()
module.exports = {
  "development": {
    "username": process.env.POSTGRES_USER,
    "password": process.env.POSTGRES_PASSWORD,
    "database": process.env.POSTGRES_DATABASE,
    "host": process.env.POSTGRES_HOST,
    "dialect": "postgres",
    "dialectOptions": {
      "useUTC": false,
      "ssl": {
        "required": true
      }
    },
    "timezone": "+07:00"
  },
  "test": {
    "username": "root",
    "password": null,
    "database": "database_test",
    "host": "127.0.0.1",
    "dialect": "mysql"
  },
  "production": {
    "use_env_variable": "POSTGRES_URL",
    "dialectOptions": {
      "ssl": {
        "rejectUnauthorized": false,
        "required": true
      }
    }
  }
}
