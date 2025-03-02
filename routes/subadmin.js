const express = require('express');
const router = express.Router()
const models = require('../db');
const { Op } = require('sequelize');
const { authorizeSubAdmin } = require('../middlewares');

router.post('/add_seafarer', authorizeSubAdmin, async (req, res) => {
    try {
        const data = req.body
        const seafarer = await models.SeaFarer.create({
            department: data.department,
            onBoardedOn: data.onBoardedOn,
            onBoardedBy: req.user.userId,
            rank: data.rank,
            vessel: data.vessel
        })
        return res.status(201).json(seafarer)
    } catch (error) {
        return res.status(500).json({ message: error.message })
    }
})

router.get('/seafarers', authorizeSubAdmin, async (req, res) => {
    try {
        const seafarers = await models.SeaFarer.findAll()
        return res.status(200).json(seafarers)
    } catch (error) {
        return res.status(500).json({ message: error.message })
    }
}
)

router.get('/seafarer/:seafarerId', authorizeSubAdmin, async (req, res) => {
    try {
        const seafarer = await models.SeaFarer.findOne({ where: { seafarerId: req.params.seafarerId } })
        if (!seafarer) return res.status(404).json({ message: 'Seafarer not found' })
        return res.status(200).json(seafarer)
    } catch (error) {
        return res.status(500).json({ message: error.message })
    }
}
)

router.delete('/delete_seafarer/:seafarerId', authorizeSubAdmin, async (req, res) => {
    try {
        const seafarer = await models.SeaFarer.findOne({ where: { seafarerId: req.params.seafarerId } })
        if (!seafarer) return res.status(404).json({ message: 'Seafarer not found' })
        await seafarer.destroy()
        return res.status(204).json()
    } catch (error) {
        return res.status(500).json({ message: error.message })
    }
}
)

router.put('/update_seafarer/:seafarerId', authorizeSubAdmin, async (req, res) => {
    try {
        const seafarer = await models.SeaFarer.findOne({ where: { seafarerId: req.params.seafarerId } })
        if (!seafarer) return res.status(404).json({ message: 'Seafarer not found' })
        const data = req.body
        await seafarer.update(data)
        return res.status(200).json(seafarer)
    } catch (error) {
        return res.status(500).json({ message: error.message })
    }
}
)

module.exports = router;