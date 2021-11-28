const jwt = require('jsonwebtoken')
const userExtractor = require('../middlewares/userExtractor')
const notesRouter = require('express').Router()
const Note = require('../models/Note')
const User = require('../models/User')

notesRouter.get('/', async (request, response) => {
  const notes = await Note.find({}).populate('user', {username:1, name:1})
  response.json(notes)
})

notesRouter.get('/:id', (request, response, next) => {
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

notesRouter.post('/' ,userExtractor , async (request, response, next) => {
  const {content, important = false} = request.body
  
  const { userId } = request

  const user = await User.findById(userId)

  if(!content){
    return response.status(400).json({
      error: 'required "content" field is missing'
    })
  }

  const newNote = new Note({
    content: content,
    date: new Date(),
    important: important,
    user: user._id
  })
  try {
    const savedNote = await newNote.save()
    user.notes = user.notes.concat(savedNote._id)
    user.save()
    response.status(201).json(savedNote)
  } catch (error) {
    next(error)
  }
})

notesRouter.put('/:id', (request, response) => {
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

notesRouter.delete('/:id' ,userExtractor , async (request, response, next) => {
  const id = request.params.id
  try {
    await Note.findByIdAndRemove(id)
    response.status(204).end()
  } catch (error) {
    next(error)
  }
})

module.exports = notesRouter