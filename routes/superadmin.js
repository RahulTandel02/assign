const { authenticate, authorizeAdmin } = require('../middlewares');

const router = require('express').Router();
const models = require('../db');
const { Op } = require('sequelize');

router.post('/add_user', authorizeAdmin, async (req, res) => {
    try {
        const { username, password, role, seafarerId } = req.body;
        if (role === 'user') return res.status(403).send({ message: 'Cannot add seafarer as admin' });
        const user = await models.User.create({ username, password, role, seafarerId });
        return res.send(user);
    } catch (error) {
        return res.status(500).send({ message: error.message });
    }
})

router.get('/list_users', authorizeAdmin, async (req, res) => {
    try {
        const users = await models.User.findAll({ where: { role: Op.ne('user') } });
        return res.send(users);
    } catch (error) {
        return res.status(500).send({ message: error.message });
    }
})

router.put('/update_user/:userId', authorizeAdmin, async (req, res) => {
    try {
        const { userId } = req.params;
        const { username, password, role, seafarerId } = req.body;
        if (role === 'user') return res.status(403).send({ message: 'Cannot update seafarer' });
        const user = await models.User.update({ username, password, role, seafarerId }, { where: { userId } });
        return res.send(user);
    } catch (error) {
        return res.status(500).send({ message: error.message });
    }
})

router.delete('/delete_user/:userId', authorizeAdmin, async (req, res) => {
    try {
        const { userId } = req.params;
        const user = await models.User.destroy({ where: { userId } });
        return res.send(user);
    } catch (error) {
        return res.status(500).send({ message: error.message });
    }
})

module.exports = router;