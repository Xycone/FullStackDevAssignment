module.exports = (sequelize, DataTypes) => {
    const Payment = sequelize.define("Payment", {
        car_id: {
            type: DataTypes.STRING,
            allowNull: false
        },
        make: {
            type: DataTypes.STRING,
            allowNull: false
        },
        model: {
            type: DataTypes.STRING,
            allowNull: false
        },
        price: {
            type: DataTypes.DECIMAL(20,2),
            allowNull: false
        }
        
    });
    return Payment;
}