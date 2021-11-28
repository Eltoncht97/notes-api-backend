require('dotenv').config()
require('./mongo')

const express = require('express')
const cors = require('cors')
const logger = require('./loggerMiddleware')
const app = express()
const notFound = require('./middlewares/notFound')
const handleErrors = require('./middlewares/handleErrors')
const usersRouter = require('./controllers/users.js')
const notesRouter = require('./controllers/notes')
const loginRouter = require('./controllers/login')
const testingRouter = require('./controllers/testing')

app.use(cors())
app.use(express.json())
app.use(logger)
app.use('/images', express.static('images'))

app.get('/', (request, response) => {
  response.send('<h1>Hello world</h1>')
})

app.use('/api/users', usersRouter)
app.use('/api/notes', notesRouter)
app.use('/api/login', loginRouter)

if(process.env.NODE_ENV === 'test' ){
  app.use('/api/testing', testingRouter)
}

app.use(notFound)
app.use(handleErrors)

// eslint-disable-next-line no-undef
const PORT = process.env.PORT || 3001
const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

module.exports = {app, server}