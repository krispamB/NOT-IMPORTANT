import express from 'express'
import { config } from 'dotenv'
config()
import cors from 'cors'
import { notFound, errorHandler } from './middleware/error.middleware.js'
import connectDB from './config/db.js'
import index from './routes/index.js'


// connectDB
connectDB()

const app = express()

// Cors
app.use(cors({ origin: '*' }))

app.use(express.json())
// Routes
app.use('/api', index)

app.use(notFound)
app.use(errorHandler)

const PORT = process.env.PORT || 8080

app.listen(PORT, () => {
  console.log(
    `Server running in ${process.env.NODE_ENV} mode on port ${PORT}`
  )
})