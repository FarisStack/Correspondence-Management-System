// 'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('users', {
      id: {
        type: Sequelize.INTEGER(11).UNSIGNED,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true,
      },
      firstName: {
        type: Sequelize.STRING(30),
        allowNull: false,
        // validate: {
        //   isGT3
        // }
      },
      middleName: {
        type: Sequelize.STRING(30),
        allowNull: false,
      },
      lastName: {
        type: Sequelize.STRING(30),
        allowNull: false,
      },
      email: {
        type: Sequelize.STRING, //default length is VARCHAR(255)
        allowNull: false,
        unique: true, //will be used to login to the system
      },
      avatar: {
        type: Sequelize.STRING(300), //store the path of the image
        allowNull: true,
      },
      phoneNumber: {
        type: Sequelize.STRING(32),
        allowNull: false,
      },
      hireDate: {
        type: Sequelize.DATEONLY, // DATE without time.
        // Since Sequelize.DATE will be converted to DATETIME for mysql. 
        allowNull: false,
      },
      userStatus: {
        type: Sequelize.ENUM(),
        // values must be array of strings
        values: [
          "regular", "in-vacation", "fired", "retired"
        ],
        defaultValue: "regular",
        allowNull: false, // although there is a default value, this default valueensures
        // that the field will not be null when record is inserted for first time,
        // but since we can update the field after insertion and make it null,
        // so that's why we put allowNull: false
      },
      role: {
        type: Sequelize.ENUM,
        values: [
          "admin", "moderator", "full-time-employee", "part-time-employee"
        ],
        defaultValue: "full-time-employee",
        allowNull: false,
      }
    });
  }
  ,
   async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('users');
  }
  
}
 
// module.s = { up, down }