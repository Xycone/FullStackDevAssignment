module.exports = (sequelize, DataTypes) => {
    const Feedback = sequelize.define("Feedback", {
        rating: {
            type: DataTypes.STRING,
            allowNull: false
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        responded: {
            type: DataTypes.BOOLEAN,
            allowNull: false
        }
    });

    return Feedback;
}