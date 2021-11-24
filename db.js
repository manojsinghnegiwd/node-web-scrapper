const mongoose = require('mongoose');

class DB {
  dbName = '';
  instance = null;

  constructor (dbName = process.env.DB_NAME) {
    this.dbName = dbName;
  }

  async connect () {
    try {
      this.instance = await mongoose.connect(`mongodb://localhost:27017/${this.dbName}`);
      console.log(`Connected with DB ${this.dbName}`);
      return this.instance;
    } catch (e) {
      console.log(`Problem connecting with DB ${this.dbName}`);
      throw e
    }
  }
}

module.exports = DB;
