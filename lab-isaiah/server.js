'use strict';

//TODOs: require in all the modules necessary for server setup
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
  // console.log('client', client);
  // console.log('socket', socket);
  pool.push(client);
  pool.forEach(c => c.socket.write(`${client.nick} has joined the channel\n`));

  // socket.on('data', data => {
  //   console.log(data.toString());
  //   // pool.forEach(c => c.socket.write(`${client.nick}: ${data.toString()}\n`));

  socket.on('data', data => {
    let cmd = data.toString().split(' ').shift().trim();
    // console.log('LOOK AT THIS!!!!!!!!!!', cmd);
    if( cmd === '@all') {
      pool.forEach(c => c.socket.write(`${client.nick} said: ${data.toString().split(' ').splice(1)}\n`));
    } else if(cmd === '@nickname') {
      pool.forEach(c => c.socket.write(`${client.nick} goes by: ${data.toString().split(' ').splice(1)}\n`));
      client.nick = data.toString().split(' ').splice(1);
    } else if(cmd === '@dm') {
      console.log('In the dm\'s:', data.toString().split(' ').splice(1, 2));
      pool.forEach(c => c.socket.write(`${data.toString().split(' ').splice(2)} to ${data.toString().split(' ').splice(1)}\n`));
    } else if (cmd === '@exit') {
      pool.forEach(c => c.socket.write(`${client.nick} has left the group\n`));
      // console.log('Connection closed');
      client.socket.destroy();
      pool.pop(this.client);
      pool.forEach(c => c.socket.write(`There are ${pool.length} users remaining!\n`));
      // console.log(pool);
    } else {
      ee.emit('default', client, data.toString().split(' ').splice(1).join());
    }
  });

  socket.on('error', err => {
    if (err) console.error(err);
  });
});
// });

server.listen(3000, () => console.log('listening on port 3000'));
