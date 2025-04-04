const { User } = require('./User');
const { Event } = require('./Event');
const { LoginHistory } = require('./LoginHistory');

Event.belongsTo(User, {
    foreignKey: 'createdBy',
    targetKey: 'id',
 });

User.hasMany(Event, { 
    foreignKey: 'createdBy',
    sourceKey: 'id',
});


LoginHistory.belongsTo(User, {
    foreignKey: 'userId',
    sourceKey: 'id',
 });

User.hasMany(LoginHistory, { 
    foreignKey: 'userId',
    sourceKey: 'id',
});

module.exports = { associate: () => {} };