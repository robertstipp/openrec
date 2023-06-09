const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const fieldRouter = require('./routes/fieldRoutes')
const reservationRouter = require('./routes/reservationRoutes')

const app = express()

// Middleware
app.use(morgan('dev'))
app.use(express.json())
app.use(cors())

app.use((req,res,next)=>{
  console.log('Howdy from the middleware 🤠')
  next()
})

// Model


// Routes

app.get('/', (req,res) => {
  res.send('Hello Word!')
})

app.use('/api/v1/fields', fieldRouter)
app.use('/api/v1/reservations',reservationRouter)








module.exports = app
