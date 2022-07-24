require('dotenv').config();

module.exports = {
  "development": {
    "username": process.env.DB_USERNAME,
    "password": process.env.DB_PASSWORD,
    // "password": "root",
    "database": process.env.DB_NAME,
    "host": "127.0.0.1",
    // "host": "192.168.1.224",
    "dialect": "mysql",
    "dialectOptions": {
    },
    "timezone": "+02:00"
  },
  "test": {
    "username": "root",
    "password": null,
    "database": "database_test",
    "host": "127.0.0.1",
    "dialect": "mysql"
  },
  "production": {
    "username": "root",
    "password": null,
    "database": "database_production",
    "host": "127.0.0.1",
    "dialect": "mysql",
    "dialectOptions": {
    },
    "timezone": "+02:00"
  }
}
