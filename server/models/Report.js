module.exports = (sequelize, DataTypes) => {
    const Report = sequelize.define("Report", {
        date: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
        },
        revenue: {
            type: DataTypes.DECIMAL(20,2),
            allowNull: false
        }
    });
    return Report;
}