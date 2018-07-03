const { MongoClient } = require('mongodb')
const api = require('./api')
const body = require('body-parser')
const co = require('co')
const express = require('express')
const next = require('next')
const mongoose = require('mongoose')
const dev = process.env.NODE_ENV !== 'production'
const app = next({ dev })
const handle = app.getRequestHandler()
const MONGO_URL = process.env.MONGO_URI || 'mongodb://localhost:27017/code-test-portal'
const PORT = 3000


co(function * () {
  // Initialize the Next.js app
  yield app.prepare()

  console.log(`Connecting to ${MONGO_URL}`)
  const db = yield mongoose.connect(MONGO_URL)
  const Session = require('./api/models/session')
  // Configure express to expose a REST API
  const server = express()
  server.use(body.json())
  server.use((req, res, next) => {
    // Also expose the MongoDB database handle so Next.js can access it.
    req.db = db
    req.Session = Session
    next()
  })
  // server.use('/api', api)

  // Everything that isn't '/api' gets passed along to Next.js
  server.get('*', (req, res) => {
    req.db = db
    req.Session = Session
    return handle(req, res)
  })

  server.listen(PORT)
  console.log(`Listening on ${PORT}`)
}).catch(error => console.error(error.stack))