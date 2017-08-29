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
    console.log(cmd);

    if(cmd === '@all') {
      console.log(data.toString().split(' ').slice(1).join() + '\n');
      pool.forEach(c => c.socket.write(data.toString().split(' ').slice(1).join() + '\n'));
    } else if(cmd === '@nick') {
      client.nick = data.toString().split(' ').pop().trim();
      console.log('Welcome to our room: ' + client.nick );
    } else if(cmd === '@dm') {
      let commandLineArr = data.toString().split(' ');
      console.log(commandLineArr);
      console.log('the 1 in cLArr', commandLineArr[1]);
      pool.forEach(client => {
        if (commandLineArr[1] === client.nick) {
          console.log(commandLineArr[2]);
          client.socket.write(commandLineArr[2]);
        };
      });
    };
  });
});

server.listen(3000, () => console.log('listening on port 3000'));
