'use strict';

const net = require('net');
const EE = require('events').EventEmitter;
const ee = new EE();
const Client = require('./model/client');
// const cmd = require('./lib/command-parser');
const PORT = process.env.PORT || 3000;

const server = net.createServer();

let pool = [];

//The events we will be emitting
ee.on('default', (client, string) => {
  client.socket.write(`Improperly formatted command: ${string.split(' ', 1)}\n`);
});

ee.on('@all', (client, string) => pool.forEach(c => c.socket.write(`${client.nick} has joined the channel\n`)));

ee.on('@nick', (client, newName) => {
  pool.filter(c=> c === client)[0].nick = newName;
  client.socket.write(`name changed to ${newName}\n`);
  pool.forEach(c => c.socket.write(`${client.nick} changed their name!`));
});

ee.on('@dm', (client, string) => {
  let mention = string.trim().split('', 2)[1];
  let mentionedClient = pool.filter(c => c.nick === mention)[0];

  mentionedClient.socket.write(`${client.nick} says: ${string.trim().split('').slice(1).join()}\n`);
  client.socket.write(`You sent a dm to ${mentionedClient} saying: ${string.trim().split('').slice(1).join()}\n`);
});

server.on('connection', socket => {
  let client = new Client(socket);
  pool.push(client);
  pool.forEach(c => c.socket.write(`A wild ${client.nick} appears in the channel!`));

  socket.on('data', data => {
    let cmd = data.toString().split(' ').shift().trim();
    console.log(cmd);
  });

  socket.on('error', (err) => {
    if (err) console.error('Alas, alack, an error!');
  });
});

server.listen(3000, () => console.log(`listening on port ${PORT}`));
