const path = require('path')
const express = require('express')
const app = express()
const server = require('http').createServer(app)
const peerServer = require('peer').ExpressPeerServer
const io = require('socket.io')(server)

app.set('port', process.env.PORT || 8080);

io.on('connection', (socket) => {
  const url = socket.request.headers.referer
  console.log('A user has connected from: ' + url, socket.id)

  socket.on('join-room', (userId) => {
    socket.join('public')
    // broadcast to room
    socket.to('public').emit('user-connected', userId)

    socket.on('disconnect', () => {
      socket.leave('public')
      socket.to('public').emit('user-disconnected', userId)
    })
  })
})

app.use('/peer', peerServer(server, { debug: true }));

app.use(express.static(path.resolve(__dirname, './template')))

server.listen(app.get('port'), function(){
  console.log('Express Server listening on port: ' + app.get('port'));
});