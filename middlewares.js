const models = require('./db');
const jwt = require('jsonwebtoken');

async function authenticate(req, res, next) {
    const token = req.headers['Authorization'];
    if (!token) {
        return res.status(401).send('Unauthorized');
    }
    const decode = jwt.verify(token, process.env.JWT_SECRET, { algorithms: 'HS256' });
    if (!decode) return res.status(401).send('Unauthorized');
    const user = await models.User.findOne({ where: { userId: decode.userId } });
    req.user = user
    next()
}

async function authorizeSuperAdmin(req, res, next) {
    if (req.user.role === 'super-admin') {
        next()
    } else {
        return res.status(403).send('Forbidden');
    }
}

async function authorizeAdmin(req, res, next) {
    if (req.user.role === 'admin' || req.user.role === 'super-admin') {
        next()
    } else {
        return res.status(403).send('Forbidden');
    }
}

async function authorizeSubAdmin(req, res, next) {
    if (req.user.role === 'sub-admin' || req.user.role === 'admin' || req.user.role === 'super-admin') {
        next()
    } else {
        return res.status(403).send('Forbidden');
    }
}

async function authorizeSeafarer(req, res, next) {
    if (req.user.role === 'user') {
        next()
    } else {
        return res.status(403).send('Forbidden');
    }
}

module.exports = {
    authenticate,
    authorizeSuperAdmin,
    authorizeAdmin,
    authorizeSubAdmin,
    authorizeSeafarer
}