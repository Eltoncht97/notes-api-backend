
const mongoose = require('mongoose')
const {server} = require('../index')
const Note = require('../models/Note')
const { initialNotes, api } = require('./helpers')



beforeEach(async () => {
  await Note.deleteMany({})

  for ( let note of initialNotes ) {
    const noteObject = new Note(note)
    await noteObject.save()
  }
})

test('notes are returned as json', async() => {
  await api
    .get('/api/notes')
    .expect(200)
    .expect('Content-Type', /application\/json/)
})
  
test('there are two notes', async() => {
  const response = await api.get('/api/notes')
  expect(response.body).toHaveLength(initialNotes.length)
})

test('the first note is nota 1', async() => {
  const response = await api.get('/api/notes')
  const contents = response.body.map(note => note.content)
  expect(contents).toContain('nota 1')
})

test('a valid new note can be added', async () => {
  const newNote = {
    content: 'Proximamente Naruto',
    important: true
  }
  await api
    .post('/api/notes')
    .send(newNote)
    .expect(201)
    .expect('Content-Type', /application\/json/)
  
  const response = await api.get('/api/notes')
  const contents = response.body.map(note => note.content)
  expect(response.body).toHaveLength(initialNotes.length+1)
  expect(contents).toContain('Proximamente Naruto')
})

test('note without content is not added', async () => {
  const newNote = {
    important: true
  }
  await api
    .post('/api/notes')
    .send(newNote)
    .expect(400)
  
  const response = await api.get('/api/notes')
  expect(response.body).toHaveLength(initialNotes.length)
})

afterAll(() => {
  mongoose.connection.close()
  server.close()
})