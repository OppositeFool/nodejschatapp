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
    console.log('user has connected');
    socket.on('pushUserToArray', (Name) => {
        users.forEach(element => {
           let temp = element.id
           newId = temp + 1
        });
        newUser = {
            id: socket.id,
            yourName: Name
        }
        users.push(newUser)
        console.log(users)
    })
    socket.on('disconnect', () => {
        console.log("user disconnected");
        const indexOfObject = users.findIndex(object => {
            return object.id === socket.id;
          });
          io.emit("emitToUser", " is disconnected", users[indexOfObject].yourName)
          users.splice(indexOfObject, 1);
        
    })
    socket.on('chat message', (msg, yourName) => {
        console.log('message: ' + msg);
        io.emit('chat message', msg, yourName)
      });
      socket.on('userIsTyping', (bool) => {
        socket.broadcast.emit('userIsTyping', bool)
      });
      socket.on('emitToUser', (text, yourName) => {
        io.emit('emitToUser', text, yourName)
      });
})




server.listen(3000)