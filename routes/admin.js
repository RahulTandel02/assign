const router = require('express').Router();

const models = require('../db');
const { Op } = require('sequelize');
const { authenticate, authorizeAdmin } = require('../middlewares');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/')
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname))
    }
})

const upload = multer({ storage: storage })


router.post('add_task', authorizeAdmin, upload.single('file'), async (req, res) => {
    try {
        const file = req.file
        const data = req.body

        let url
        if (file) {
            // upload file to required file hosting servive like s3 or cloudinary
            // save the file url to db
        }
        const task = await models.Task.create({
            taskName: data.taskName,
            taskDescription: data.taskDescription,
            createdBy: req.user.userId,
            url
        })
        return res.status(201).json(task)

    } catch (error) {
        return res.status(500).json({ message: error.message })
    }
})

router.get('/assign_task/:taskId/:seafarerId', authorizeAdmin, async (req, res) => {
    try {
        const task = await models.Task.findOne({ where: { taskId: req.params.taskId } })
        if (!task) return res.status(404).json({ message: 'Task not found' })

        const seafarer = await models.SeaFarer.findOne({ where: { seafarerId: req.params.seafarerId } })
        if (!seafarer) return res.status(404).json({ message: 'Seafarer not found' })

        const userTask = await models.UserTask.create({
            taskId: req.params.taskId,
            seafarerId: req.params.seafarerId,
            status: 'assigned'
        })

        return res.status(201).json(userTask)

    } catch (error) {
        return res.status(500).json({ message: error.message })
    }
}
)

router.delete('/delete_task/:taskId', authorizeAdmin, async (req, res) => {
    try {
        const task = await models.Task.findOne({ where: { taskId: req.params.taskId } })
        if (!task) return res.status(404).json({ message: 'Task not found' })
        const userTask = await models.UserTask.findOne({
            where: {
                taskId: req.params.taskId,
                status: 'assigned'
            }
        })
        if (userTask) return res.status(400).json({ message: 'Task is assigned to a seafarer' })
        await task.destroy()
        return res.status(204).json()

    } catch (error) {
        return res.status(500).json({ message: error.message })
    }
})

router.put('/update_task/:taskId', authorizeAdmin, async (req, res) => {
    try {
        const task = await models.Task.findOne({ where: { taskId: req.params.taskId } })
        if (!task) return res.status(404).json({ message: 'Task not found' })
        const data = req.body
        await task.update(data)
        return res.status(200).json(task)

    } catch (error) {
        return res.status(500).json({ message: error.message })
    }
})

module.exports = router;