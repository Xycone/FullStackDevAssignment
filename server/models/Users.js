module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define("User", {
    email: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    admin: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  });
  User.associate = (models) => {
    User.hasMany(models.Listings, {
        foreignKey: "userId",
        onDelete: "cascade"
    });
};

return User;
}