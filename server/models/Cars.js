module.exports = (sequelize, DataTypes) => {
    const Cars = sequelize.define("Cars", {
        currentLocation: {
            type: DataTypes.STRING,
            allowNull: false
        },
        serviceStatus: {
            type: DataTypes.BOOLEAN,
            allowNull: false
        }
    });
    Cars.associate = (models) => {
        Cars.belongsTo(models.Listings, {
            foreignKey: "listingId",
            as: 'cars',
            onDelete: "cascade"
        });
    };
    return Cars;
}