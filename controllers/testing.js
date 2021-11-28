const tesingRouter = require('express').Router()
const User = require('../models/User')
const Note = require('../models/Note')

tesingRouter.post('/reset', async (request, response) => {
  await Note.deleteMany({})
  await User.deleteMany({})

  response.status(204).end()
})

module.exports = tesingRouter