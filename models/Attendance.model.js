const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const User = require("./User.model");

const Attendance = sequelize.define("Attendance", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  userId: {
    type: DataTypes.STRING,
    allowNull: false,
    references: {
      model: User,
      key: "id",
    },
  },
  checkIn: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  checkOut: {
    type: DataTypes.DATE,
    allowNull: true,
  },
});

Attendance.belongsTo(User, { as: "user", foreignKey: "userId" });

module.exports = Attendance;
