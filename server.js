const express = require('express')
const app = express()
const http = require('http')
const server = http.createServer(app)
const { Server } = require("socket.io")
const io = new Server(server)


//bootstrap
app.use('/css', express.static('./node_modules/bootstrap/dist/css'))
app.use('/js', express.static('./node_modules/bootstrap/dist/js'))
app.use('/js', express.static('./node_modules/jquery/dist'))


app.set('view engine', 'ejs')

app.get('/', (req, res) => {
    res.render(__dirname + "/views/index.ejs")
})

io.on('connection', (socket) => {
    socket.broadcast.emit("emitToUser", "user connected")
    console.log('user has connected');
    socket.on('disconnect', () => {
        socket.broadcast.emit("emitToUser", "user disconnected")
        console.log("user disconnected");
    })
    socket.on('chat message', (msg, yourName) => {
        console.log('message: ' + msg);
        io.emit('chat message', msg, yourName)
      });
      socket.on('userIsTyping', (bool) => {
        socket.broadcast.emit('userIsTyping', bool)
      });
})




server.listen(3000)