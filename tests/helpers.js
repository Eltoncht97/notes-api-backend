const supertest = require('supertest')
const { app } = require('../index')
const User = require('../models/User')

const api = supertest(app)

const initialNotes = [
  {
    content: 'nota 1',
    important: true,
    date: new Date()
  },
  {
    content: 'nota 2',
    important: true,
    date: new Date()
  }
]

const getUsers = async () => {
  const usersDB = await User.find({})
  return usersDB.map(user => user.toJSON())
}

module.exports = { initialNotes, api, getUsers }