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
    imageFile: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  });
  User.associate = (models) => {
    User.hasMany(models.Listings, {
      foreignKey: "userId",
      onDelete: "cascade",
    });
    User.hasMany(models.FeedbackUser, {
      foreignKey: "userId",
      onDelete: "cascade",
    });
  };

  return User;
};
