const express = require('express');
const router = express.Router()
const models = require('../db');
const { Op } = require('sequelize');
const { authorizeSeafarer } = require('../middlewares');


router.get('/tasks', authorizeSeafarer, async (req, res) => {
    try {
        const tasks = await models.UserTask.findAll(
            {
                where: {
                    seafarerId: req.user.id
                },
                include: [
                    {
                        model: models.Task
                    }
                ]
            }
        )
        return res.status(200).json(tasks)
    } catch (error) {
        return res.status(500).json({ message: error.message })
    }
})

router.put('/update_status/:id', authorizeSeafarer, async (req, res) => {
    try {
        const { id } = req.params
        const task = await models.UserTask.findOne({ where: { id } })
        if (!task) return res.status(404).json({ message: 'Task not found' })
        const data = req.body
        await task.update({ status: data.status }, { where: { id } })
        return res.status(200).json(task)
    } catch (error) {
        return res.status(500).json({ message: error.message })
    }
})

router.get('/seafarer', authorizeSeafarer, async (req, res) => {
    try {
        const seafarer = await models.SeaFarer.findOne({ where: { seafarerId: req.user.seafarerId } })
        return res.status(200).json(seafarer)
    } catch (error) {
        return res.status(500).json({ message: error.message })
    }
}
)

router.get('/generate_report', authorizeSeafarer, async (req, res) => {
    try {
        const tasks = await models.UserTask.findAll(
            {
                where: {
                    seafarerId: req.user.id
                },
                include: [
                    {
                        model: models.Task
                    }
                ]
            }
        )
        const report = tasks.map(task => {
            return {
                taskName: task.task.taskName,
                taskDescription: task.task.taskDescription,
                status: task.status
            }
        })
        return res.status(200).json(report)
    } catch (error) {
        return res.status(500).json({ message: error.message })
    }
})

module.exports = router;