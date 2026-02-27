require('dotenv').config()
const express = require('express')
const cors = require('cors')
const pool = require('./config/db')
const authRoutes = require('./modules/auth/auth.routes')

const app = express()

app.use(cors())
app.use(express.json())



app.use('/api/auth', authRoutes)

const PORT = process.env.PORT || 5000

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})