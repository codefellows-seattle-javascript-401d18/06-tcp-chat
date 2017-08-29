'use strict'

const net = require('net')
const EE = require('events').EventEmitter
const ee = new EE()
const Client = require('./model/client')

const server = net.createServer()

let pool = []

ee.on('default', (client, string) => {
  client.socket.write(`Improperly formatted command: ${string.split(' ', 1)}\n`)
})

server.on('connection', socket => {
  let client = new Client(socket)
  pool.push(client)
  pool.forEach(c => c.socket.write(`${client.nick} has joined the channel\n`))

  socket.on('data', data => {
    let cmd = data.toString().split(' ').shift().trim()
    console.log(cmd)

    if(cmd === '@all') {
      pool.forEach(c => c.socket.write(`${client.nick}: ${data.toString()}\n`))

    } else if(cmd === '@nick') {
      let aGuest = data.toString().split(' ').slice(1,2).join().trim();
      pool.forEach(c => c.socket.write(`${client.nick} changed their name to ${aGuest}\n`))
      client.nick = aGuest

    } else if(cmd === '@dm') {
      let aGuest = data.toString().split(' ').slice(1,2).join();
      pool.forEach(function(c) {
        if (c.nick === aGuest){
          c.socket.write(`${client.nick}: ${data.toString()}\n`)
        }
      })
    } else {
      ee.emit('default', client, data.toString().split(' ').slice(1).join())
    }
  })
  socket.on('error', error =>{
    console.log(error)
  })
  socket.on('close', close => {
    var index = pool.indexOf(client)
    if (index > -1) {
      pool.splice(index, 1);
      console.log('pool', pool)
    }
    pool.forEach(c => c.socket.write(`${client.nick} has left the channel\n`))
  })
})


server.listen(3000, () => console.log('listening on port 3000'))
