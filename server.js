const http = require('http')
const express = require('express')
const bodyParser = require('body-parser')
const MessagingResponse = require('twilio').twiml.MessagingResponse
const WebSocket = require('ws')
const { getIdentity, getUsers, addScore } = require('./utils')

const app = express()

const broadcast = clients => {
  clients.forEach(client => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(getUsers()))
    }
  })
}

app.use(bodyParser.urlencoded({ extended: false }))

app.post('/sms', (req, res) => {
  console.log(req.body)
  const user = getIdentity(req.body)
  addScore(user, req.body.Body)
  const twiml = new MessagingResponse()

  broadcast(req.app.locals.clients)

  twiml.message('👍')

  res.writeHead(200, { 'Content-Type': 'text/xml' })
  res.end(twiml.toString())
})

const server = http.createServer(app)

// initialize the WebSocket server instance
const wss = new WebSocket.Server({ server })

wss.on('connection', ws => {
  console.info('Total connected clients is %s', wss.clients.size)

  broadcast(wss.clients)

  app.locals.clients = wss.clients

  // let userCount = 0

  // const interval1 = setInterval(() => {
  //   if (userCount <= 33) {
  //     getIdentity({ From: userCount })
  //     userCount++
  //     broadcast(app.locals.clients)
  //   } else {
  //     clearInterval(interval1)
  //     let pointCount = 15

  //     const interval2 = setInterval(() => {
  //       if (pointCount > 0) {
  //         const users = getUsers()
  //         users.map(user => {
  //           addScore(user, Math.round(Math.random()) === 1 ? 'yes' : 'no')
  //           broadcast(app.locals.clients)
  //         })
  //         pointCount--
  //       } else {
  //         clearInterval(interval2)
  //       }
  //     }, 2000)
  //   }
  // }, 300)
})

server.listen(3001, () => {
  console.log('Express/WS server listening on port 3001')
})
