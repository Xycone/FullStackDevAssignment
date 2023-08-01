module.exports = (sequelize, DataTypes) => {
    const Listings = sequelize.define("Listings", {
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
        }
    });
    Listings.associate = (models) => {
        Listings.belongsTo(models.User, {
            foreignKey: "userId",
            as: 'user',
            onDelete: "cascade"
        });
        Listings.hasMany(models.Cars, {
            foreignKey: "listingId",
            onDelete: "cascade"
        });
    };
    
    return Listings;
}