module.exports = (sequelize, DataTypes) => {
    const Discounts = sequelize.define("Discounts", {
        
        discount: {
            type: DataTypes.DECIMAL(20,2),
            allowNull: false
        },
        disctype: {
            type: DataTypes.STRING,
            allowNull: false
        },
        reqtype:{
            type: DataTypes.STRING,
            allowNull: true
        },
        listingId:{
            type: DataTypes.DECIMAL(20,0),
            allowNull: true
        },
        minspend:{
            type: DataTypes.DECIMAL(20,2),
            allowNull: true
        },
        enddate:{
            type: DataTypes.STRING,
            allowNull: false
        }
    });
    return Discounts;
}