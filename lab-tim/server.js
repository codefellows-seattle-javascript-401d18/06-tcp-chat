'use strict';

// TODO: require in all the modules necessary for server setup
const net = require('net');
const EE = require('events').EventEmitter;
const ee = new EE();
const Client = require('./model/client');
const PORT = process.env.PORT || 3000;
const server = net.createServer();
const pool = [];

// TODO: Create the @dm, @nick, @all commands. Anything else should emit a 'default' event
// @all HEY THERE => this will broadcast to all clients
// @dm tim HEY THERE => this will broadcast to ONLY tim
// @nick scott => will change the nickname of this client to scott

ee.on('default', (client, string) => {
  client.socket.write(`Improperly formatted command: ${string.split(' ', 1)}\n`);
});

ee.on('@dm', (client, string) => {
  let from = client.nick;
  let target = string.split(' ').splice(0,1).toString();
  let message = string.split(' ').splice(1).join(' ');
  // console.log(from);
  // console.log(target);
  // console.log(message);
  pool.forEach(c => {
    if(c.nick === target) {
      c.socket.write(`${from}: ${message}`);
    }
  });
});

ee.on('@all', (client, string) => {
  pool.forEach(c => c.socket.write(`${client.nick}: ${string}`));
});

ee.on('@nick', (client, string) => {
  client.nick = string.split(' ').shift().trim();
  client.socket.write(`Your nickname is now ${client.nick}\n`);
});

server.on('connection', socket => {
  let client = new Client(socket);
  pool.push(client);
  pool.forEach(c => c.socket.write(`${client.nick} has joined the channel\n`));
  console.log(`${client.nick} has joined the channel\n`);
  socket.on('data', data => {
    let cmd = data.toString().split(' ').shift().trim();
    console.log(`${client.nick} sent command: `, data.toString());
    if(cmd.startsWith('@')) {
      ee.emit(cmd, client, data.toString().split(' ').slice(1).join(' '));
    } else {
      ee.emit('default', client, data.toString().split(' ').slice(1).join());
    }
  });

  socket.on('error', (client, err) => {
    console.log('Socket Error: ', err);
  });

  socket.on('close', client => {
    console.log('Socket Closed');
    pool.forEach(c => c.socket.write('A user has left the channel\n'));
    pool.forEach( (c, i) => {
      if(c.nick === client.nick){
        pool.splice(i);
      }
    });
  });
});

server.listen(PORT, () => console.log('Listening on port: ', PORT));
