import Sequelize from 'sequelize';

import Users from '../app/models/Users';

import configDB from '../config/database';

const models = [Users];

class Database {
  constructor() {
    this.connection = new Sequelize(configDb);
    this.init();
    this.associate();
  }

  init() {
    models.forEach(model => model.init(this.connection));
  }

  associate() {
    models.forEach(model => {
      if (model.associate) {
        model.associate(this.connection.models);
      }
    });
  }
}

export default new Database();
