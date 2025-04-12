import User from "./User.js";
import Event from "./Event.js";
import LoginHistory from "./LoginHistory.js";
function setupAssociations() {
    Event.belongsTo(User, {
        foreignKey: "createdBy",
        targetKey: "id",
    });
    User.hasMany(Event, {
        foreignKey: "createdBy",
        sourceKey: "id",
    });
    LoginHistory.belongsTo(User, {
        foreignKey: "userId",
        targetKey: "id",
    });
    User.hasMany(LoginHistory, {
        foreignKey: "userId",
        sourceKey: "id",
    });
}
export const associate = setupAssociations;
