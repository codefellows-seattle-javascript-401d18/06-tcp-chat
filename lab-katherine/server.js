//require in all the modules for server setup =
'use strict'
const net = require('net')
const EE = require('events').EventEmitter
const ee = new EE()
const Client = require('./model/client')

const server = net.createServer()

let pool = []

//TODO create the @dm, @nick, @all commands anything else should emit a default

ee.on('default', (client, string) => {
  //if i type a comman and transmit hello world you haven't specified who you are addressing, so this will catch all improperly formatted commands
  client.socket.write(`improperly formatted command: ${string.split(' ', 1)}\n`)
})

server.on('connection', socket => {
  //the server is going to hear the connection, create a socket, and pass that socket to the callback - the socket it our connection to the server
  let client = new Client(socket)
  pool.push(client)
  //iterate over the client pool and write to everyone's socket - this allows us both read and write access
  //can broadcast to everyone by writing to their socket
  pool.forEach(c => c.socket.write(`${client.nick} has joined the channel\n`))

  socket.on('data', data => {
    //when data is transported, it is done in the form of a buffer
    // data.toString() => will need to print whatever data was transmitted
    let cmd = data.toString().split(' ').shift().trim()
    if(cmd === '@all'){
      // pool.forEach(c => c.socket.write(data.toString()))

    } else if (cmd === '@dm'){

    } else {
    ee.emit('default', client, data.toString().split(' ').slice(1).join())
  }
  })
})

//to start a server mybe nc localhost 3000
//man nc
//telnet localhost:3000
server.listen(3000, () => console.log(`listening on port 3000`))
