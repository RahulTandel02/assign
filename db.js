const { Sequelize } = require('sequelize');


const sequelize = new Sequelize({
    host: ':memory:',
    dialect: 'sqlite',
});


const User = sequelize.define('users', {
    userId: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
    username: { type: Sequelize.STRING, allowNull: false, unique: true },
    password: { type: Sequelize.STRING, allowNull: false },
    role: { type: Sequelize.STRING, validate: { isIn: [['admin', 'super-admin', 'sub-admin', 'user']] } },
    seafarerId: { type: Sequelize.INTEGER, allowNull: true }
})

const Task = sequelize.define('tasks', {
    taskId: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
    taskName: { type: Sequelize.STRING, allowNull: false },
    taskDescription: { type: Sequelize.STRING, allowNull: false },
    createdBy: { type: Sequelize.INTEGER, allowNull: false },
    url: { type: Sequelize.STRING, allowNull: false }
})

const UserTask = sequelize.define('user_tasks', {
    id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
    taskId: { type: Sequelize.INTEGER, allowNull: false },
    seafarerId: { type: Sequelize.INTEGER, allowNull: false },
    status: { type: Sequelize.STRING, validate: { isIn: [['assigned', 'completed']] }, allowNull: false }
})

const SeaFarer = sequelize.define('seafarers', {
    seafarerId: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
    department: { type: Sequelize.STRING, allowNull: false },
    onBoardedOn: { type: Sequelize.DATE, allowNull: false },
    onBoardedBy: { type: Sequelize.INTEGER, allowNull: false },
    rank: { type: Sequelize.STRING, allowNull: false },
    vessel: { type: Sequelize.STRING, allowNull: false },

})

const db = {
    User,
    Task,
    UserTask,
    SeaFarer,
    sequelize
}


module.exports = db;