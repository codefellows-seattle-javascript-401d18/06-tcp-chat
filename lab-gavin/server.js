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




server.on('error', client => {
  console.log('There is an error, you are being disconnected.');
  console.log(err);
  pool = pool.filter(item => item !== `${client.nickName}`);
});

server.on('close', client  => {
  console.log(`${client.nickName} has left the chat`);
  pool = pool.filter(item => item !== `${client.nickName}`);
});


server.on('connection', socket => {
  let client = new Client(socket);
  pool.push(client);
  pool.forEach(c => c.socket.write(`${client.nickName} has joined the channel\n`));

  socket.on('data', data => {
    let cmd = data.toString().split(' ').shift().trim();
    if(cmd === '@all') {
      pool.forEach(c => c.socket.write(`${client.nickName} => ` + data.toString().split(' ').pop()));

    } else if (cmd === `@nickname`) {
      client.nickName = data.toString().split('@nickname ')[1].trim();

    } else if (cmd === '@dm') {

      let nickname = data.toString().split(' ')[1];
      let message = data.toString().split(' ');

      pool.forEach( c => {

        if (c.nickName === nickname || c.id === nickname) {
          c.socket.write(`DM from ${client.nickName}: ${message} \n`);
        }
      });
    } else if (cmd === '@exit'){
      console.log('first pool', pool);

      let user = client.nickName;
      console.log('user', user);
      pool.forEach((c) => {
        c.socket.write(`\n${user} has quit!`);
        if (user === c.nickName){
          delete(c.socket);
          console.log('second pool',pool);
        }
      });
      client.socket.end();

    } else {
      ee.emit('default', client, data.toString().split(' ').slice(1).join());
    }
  });
});


server.listen(3000, () => console.log('listening on port 3000'));
