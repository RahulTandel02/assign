const express = require('express');
const app = express();
const dotenv = require('dotenv');
dotenv.config();
const db = require('./db');
const { authenticate } = require('./middlewares');
const superAdminRoutes = require('./routes/superadmin');
const subAdminRoutes = require('./routes/subadmin');
const seafarerRoutes = require('./routes/seafarer');
const authRoutes = require('./routes/auth');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/syncDb', async (req, res) => {
    try {
        await db.sequelize.sync({ force: true });
        return res.status(200).send('Database synced successfully');
    } catch (error) {
        return res.status(500).send({ message: error.message });
    }
}
)

app.use('/auth', authRoutes);
app.use(authenticate)
app.use('/superadmin', superAdminRoutes);
app.use('/subadmin', subAdminRoutes);
app.use('/seafarer', seafarerRoutes);



db.sequelize.authenticate()
    .then(() => {
        console.log('Database connected');
    })
    .catch((error) => {
        console.log('Error connecting to database', error);
    })

app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
})