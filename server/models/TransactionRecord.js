module.exports = (sequelize, DataTypes) => {
    const TransactionRecord = sequelize.define("TransactionRecord", {
        carId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'Cars',
                key: 'id',
            }
        },
        productPrice: {
            type: DataTypes.DECIMAL(20, 1),
            allowNull: false
        },
        productName: {
            type: DataTypes.STRING,
            allowNull: false
        },
        startDate: {
            type: DataTypes.DATE,
            allowNull: false
        },
        endDate: {
            type: DataTypes.DATE,
            allowNull: false
        },
    });
    TransactionRecord.associate = (models) => {
        TransactionRecord.belongsTo(models.Cars, {
            foreignKey: "carId",
            as: 'car',
            onDelete: "cascade"
        });
        TransactionRecord.belongsTo(models.User, {
            foreignKey: "userId",
            as: 'user',
            onDelete: "cascade"
        });
    };
    return TransactionRecord;
}