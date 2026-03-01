require('dotenv').config()

const express = require('express')
const cors = require('cors')
const pool = require('./config/db')
const authRoutes = require('./modules/auth/auth.routes')
const authMiddleware = require('./middleware/auth.middleware')
const driveRoutes = require('./modules/drives/drive.routes')
const roundRoutes = require("./modules/rounds/round.routes");
const app = express()

app.use(cors())
app.use(express.json())

app.use('/api/auth', authRoutes)
app.use('/api/drives', driveRoutes)
app.use("/api", roundRoutes)

app.get('/api/protected', authMiddleware, (req, res) => {
  res.json({
    message: 'You accessed protected route',
    user: req.user
  })
})

const PORT = process.env.PORT || 5000

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})