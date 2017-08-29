'use strict';

// TODO: require in all the modules necessary for server setup
const net = require('net');
const EE = require('events').EventEmitter;
const ee = new EE();
const Client = require('./model/client');

const server = net.createServer();

let pool = [];

// ${string.split(' ', 1)}
ee.on('default', (client) => {
  client.socket.write(`Wow, I'm glad you're eager to chat but...\n +++Please use "@all" to type a message to all users in the chat room.\n +++Use "@dm username" to send a direct message to a specific user, replacing username with the desired user's username.\n +++To change your own username "@nickname username", replacing username with the desired user name.\n Thanks and have a great day!\n`);
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
      pool.forEach(c => c.socket.write(`${client.nickName} => ` + data.toString().split(' ').slice(1).join(' ')));

    } else if (cmd === `@nickname`) {
      client.nickName = data.toString().split('@nickname ')[1].trim();

    } else if (cmd === '@dm') {

      let nickname = data.toString().split(' ')[1];
      let message = data.toString().split(' ').slice(2).join(' ');

      pool.forEach( c => {
        if (c.nickName === nickname || c.id === nickname) {
          c.socket.write(`DM from ${client.nickName}: ${message} \n`);
        }
      });
    } else if (cmd === '@exit'){
      let user = client.nickName;
      pool.forEach((c) => {
        c.socket.write(`\n${user} has quit!`);
        if (user === c.nickName){
          client.socket.end();
          delete(c.socket);
          delete(c.nickName);
          delete(c._id);
        }
        for (var i = 0; i < pool.length; i++){
          if (pool[i].nickName === user){
            pool.splice(i, 1);
          }
        }
      });

    } else {
      ee.emit('default', client);
    }
  });
});


server.listen(3000, () => console.log('listening on port 3000'));
