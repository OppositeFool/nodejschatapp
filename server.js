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


var users = []
io.on('connection', (socket) => {
 // socket.removeAllListeners('chat message');
  console.log('user has connected');
  socket.on('pushUserToArray', (Name) => {
      users.forEach(element => {
         if(element.id === socket.id) return
      });
      newUser = {
          id: socket.id,
          yourName: Name
      }
      users.push(newUser)
      io.emit("getUsers", users)
      console.log(users)
  })
  socket.on('disconnect', () => {
    console.log(users);
    for (let index = 0; index < users.length; index++) {
      const element = users[index];
      if(element.id === socket.id)
      {
        users.splice(index, 1);
        io.emit("getUsers", users)
        socket.broadcast.emit("emitToUser", " is disconnected", element.yourName)
        break;
      }
    }
  })
  socket.on('chat message', (msg, yourName) => {
      console.log('message: ' + msg);
      io.emit('chat message', msg, yourName)
    });
    socket.on('userIsTyping', (bool) => {
      socket.broadcast.emit('userIsTyping', bool)
    });
    socket.on('emitToUser', (text, yourName) => {
     socket.broadcast.emit('emitToUser', text, yourName)
   });
})



server.listen(3000)