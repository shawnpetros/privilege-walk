const http = require('http')
const express = require('express')
const bodyParser = require('body-parser')
const MessagingResponse = require('twilio').twiml.MessagingResponse
const WebSocket = require('ws')

const app = express()

const messages = []

const broadcast = clients => {
  clients.forEach(client => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(messages))
    }
  })
}

app.use(bodyParser.urlencoded({ extended: false }))

app.post('/sms', (req, res) => {
  console.log(req.body)
  messages.push(req.body)
  const twiml = new MessagingResponse()

  broadcast(req.app.locals.clients)

  twiml.message('Your response was recieved!')

  res.writeHead(200, { 'Content-Type': 'text/xml' })
  res.end(twiml.toString())
})

const server = http.createServer(app)

// initialize the WebSocket server instance
const wss = new WebSocket.Server({ server })

wss.on('connection', ws => {
  console.info('Total connected clients is %s', wss.clients.size)

  app.locals.clients = wss.clients
})

server.listen(3001, () => {
  console.log('Express/WS server listening on port 3001')
})
