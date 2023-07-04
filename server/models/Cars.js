module.exports = (sequelize, DataTypes) => {
    const Cars = sequelize.define("Cars", {
        imageFile: {
            type: DataTypes.STRING
        },
        make: {
            type: DataTypes.STRING,
            allowNull: false
        },
        model: {
            type: DataTypes.STRING,
            allowNull: false
        },
        range: {
            type: DataTypes.DECIMAL(20, 1),
            allowNull: false
        },
        price: {
            type: DataTypes.DECIMAL(20, 2),
            allowNull: false
        },
        status: {
            type: DataTypes.BOOLEAN,
            allowNull: false
        }
    });
    Cars.associate = (models) => {
        Cars.belongsTo(models.Cars, {
            foreignKey: "userId",
            as: 'user'
        });
    };
    return Cars;
}