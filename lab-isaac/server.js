'use strict';

// TODO: require in all the modules necessary for server setup
const net = require('net');
const EE = require('events').EventEmitter;
const ee = new EE();
const Client = require('./model/client');

const server = net.createServer();

let pool = [];

// TODO: Create the @dm, @nick, @all commands. Anything else should emit a 'default' event
// @all HEY THERE => this will broadcast to all clients
// @dm tim HEY THERE => this will broadcast to ONLY tim
// @nick scott => will change the nickname of this client to scott

ee.on('default', (client, string) => {
  client.socket.write(`Improperly formatted command: ${string.split(' ', 1)}\n`);
});
ee.on('ended', (client) => {
  pool.forEach(c => c.socket.write(`${client.nick} has left chat\n`));
});

server.on('connection', socket => {
  let client = new Client(socket);
  pool.push(client);
  pool.forEach(c => c.socket.write(`${client.nick} has joined the channel\n`));

  socket.on('data', data => {
    let cmd = data.toString().split(' ').shift().trim();

    if(cmd === '@all') {
      pool.forEach(c => c.socket.write(`${client.nick} to ${data.toString()}`));

    } else if (cmd === '@nick') {
      client.nick = data.toString().split(' ').pop().trim();
    }

    else if (cmd === '@dm') {
      pool.forEach(function(c) {
        if(c.nick === data.toString().split(' ').slice(1,2).pop()) {
          c.socket.write(`${client.nick}: ${data.toString().split(' ').slice(2).join(' ').trim()}\n`);
        }
      });
    }

    else if (cmd === 'exit') {
      ee.emit('ended', client);
      client.socket.end();
      pool.filter(function(ele, idx) {
        if(pool[idx].nick === client.nick) {
          delete pool[idx];
        }
      });
      //found sorting function on 
      pool.sort(function(x, y) {
        return (x === y)? 0 : x? 1 : -1;
      });
      pool.pop();
    }

    else {
      ee.emit('default', client, data.toString().split(' ').slice(1).join());
    }
  });
});


server.listen(3000, () => console.log('listening on port 3000'));
