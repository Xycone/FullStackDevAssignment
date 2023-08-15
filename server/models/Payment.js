module.exports = (sequelize, DataTypes) => {
    const Payment = sequelize.define("Payment", {
        carId: {
            type: DataTypes.STRING,
            allowNull: false
        },
        carname: {
            type: DataTypes.STRING,
            allowNull: false
        },
        total: {
            type: DataTypes.DECIMAL(20,2),
            allowNull: false
        },
        date: {
            type: DataTypes.STRING,
            allowNull: false
        }
        
    });
    return Payment;
}