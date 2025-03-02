const express = require('express')
const router = express.Router()
const models = require('../db')
const { Op } = require('sequelize')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

router.get('/create_superadmin', async (req, res) => {
    try {
        const data = {
            username: 'superadmin',
            password: 'superadmin',
            role: 'super-admin'
        }
        const user = await models.User.create(data)
        return res.status(201).json(user)
    } catch (error) {
        return res.status(500).json({ message: error.message })

    }
})

router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body
        const user = await models.User.findOne({ where: { username } })
        if (!user) return res.status(401).json({ message: 'Invalid credentials' })
        if (!bcrypt.compareSync(password, user.password)) return res.status(401).json({ message: 'Invalid credentials' })
        const token = jwt.sign({ userId: user.userId, role: user.role }, process.env.JWT_SECRET, { algorithm: 'HS256' })
        return res.status(200).json(token)
    } catch (error) {
        return res.status(500).json({ message: error.message })
    }
})

module.exports = router