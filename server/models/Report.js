module.exports = (sequelize, DataTypes) => {
    const Report = sequelize.define("Report", {
        date: {
            type: DataTypes.STRING,
            allowNull: false
        },
        revenue: {
            type: DataTypes.DECIMAL(20,2),
            allowNull: false
        }
    });
    return Report;
}