import Sequelize, { Model } from 'sequelize';

class Students extends Model {
  static init(sequelize) {
    super.init(
      {
        name: Sequelize.STRING,
        email: Sequelize.STRING,
        weight: Sequelize.FLOAT,
        heigth: Sequelize.FLOAT,
      },
      {
        sequelize,
      }
    );
  }
}

export default Students;
