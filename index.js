require('dotenv').config()
require('./mongo')

const express = require('express')
const cors = require('cors')
const logger = require('./loggerMiddleware')
const app = express()
const Note = require('./models/Note')
const notFound = require('./middlewares/notFound')
const handleErrors = require('./middlewares/handleErrors')

app.use(cors())
app.use(express.json())
app.use(logger)
// app.use('/images', express.static('images'))

app.get('/', (request, response) => {
  response.send('<h1>Hello world</h1>')
})

app.get('/api/notes', (request, response) => {
  Note.find({}).then(notes => {
    response.json(notes)
  })
})

app.get('/api/notes/:id', (request, response, next) => {
  const id = request.params.id
  Note.findById(id)
    .then(note => {
      if(note) return response.json(note)
      response.status(404).end()
    })
    .catch(error => {
      next(error)
    })
})

app.put('/api/notes/:id', (request, response, next) => {
  const id = request.params.id
  const note = request.body

  const newNoteInfo = {
    content: note.content,
    important: note.important
  }

  Note.findByIdAndUpdate(id, newNoteInfo, { new: true })
    .then(result => {
      response.status(200).json(result)
    })
})

app.delete('/api/notes/:id', (request, response, next) => {
  const id = request.params.id
  Note.findByIdAndRemove(id)
    .then(() => {
      response.status(204).end()
    })
    .catch(error => {
      next(error)
    })
})

app.post('/api/notes', (request, response) => {
  const note = request.body

  if(!note || !note.content){
    return response.status(400).json({
      error: 'note.content is missing'
    })
  }

  const newNote = new Note({
    content: note.content,
    date: new Date(),
    important: note.important || false
  })

  newNote.save().then(savedNote => {
    response.status(201).json(savedNote)
  })

})

app.use(notFound)
app.use(handleErrors)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})