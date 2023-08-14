module.exports = (sequelize, DataTypes) => {
    const FeedbackUser = sequelize.define("FeedbackUser", {
    });
    FeedbackUser.associate = (models) => {

        FeedbackUser.belongsTo(models.User, {
            foreignKey: "userId",
            as: 'user',
            onDelete: "cascade"
        });
        FeedbackUser.hasMany(models.Feedback, {
            foreignKey: "feedbackUserId",
            onDelete: "cascade"
        });
    };

    return FeedbackUser;
}