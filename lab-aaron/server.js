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
  console.log('client', client);
  pool.push(client);
  pool.forEach(c => c.socket.write(`${client.nick} has joined the channel\n`));

  socket.on('data', data => {
    let cmd = data.toString().split(' ').shift().trim();
    console.log(cmd);
    if(cmd === '@all') {
      pool.foreach(c => c.socket.write(data.toString()));
    } else {
      ee.emit('default', client, data.toString().split(' ').slice(1).join());
    }

  });
});
server.listen(3000, () => console.log('Listening on port 3000'));
