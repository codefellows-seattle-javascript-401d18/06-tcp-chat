'use strict';

const net = require('net');
const EE = require('events').EventEmitter;
const ee = new EE();
const Client = require('./model/client');

const server = net.createServer();

let pool = [];

ee.on('default', (client, string) => {
  client.socket.write(`Improperly formatted command: ${string.split(' ', 1)}\n`);
});

server.on('connection', socket => {
  let client = new Client(socket);
  pool.push(client);
  pool.forEach(c => c.socket.write(`${client.nick} has joined the channel\n`));

  socket.on('data', data => {
    let cmd = data.toString().split(' ').shift().trim();
    if(cmd === '@all') {
      pool.forEach(c => c.socket.write(`${client.nick} said: ${data.toString()}`));
    } else if(cmd === '@nickname') {
      pool.forEach(c => c.socket.write(`${client.nick} goes by: ${data.toString()}\n`));
      client.nick = data.toString().split(' ')[1];
    } else if(cmd === '@dm') {
      pool.forEach(function(c) {
        if(c.nick === data.toString().split(' ')[1]){
          console.log(client.nick, data.toString().split(' ')[1]);
          c.socket.write(`${client.nick}: ${data.toString().split(' ').slice(2).join(' ').trim()}\n`);
        }
      });
    } else if(cmd === '@exit'){
      pool.forEach(c => c.socket.write(`${client.nick} has left chat\n`));
      client.socket.end();
      delete this.client;
    } else {
      ee.emit('default', client, data.toString().split(' ').slice(1).join());
    }
  });
  socket.on('error', function(err) {
    console.log('Error in the Socket', (err));
    socket.destroy();
  });
  socket.on('disconnect', function () {
    delete this.client;
  });
});
server.listen(3000, () => console.log('Listening on port 3000'));
