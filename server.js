'use strict';

const net = require('net');
const EE = require('events');
const Client = require(`${__dirname}/model/client.js`);
const PORT = process.env.PORT || 3000;
const server = net.createServer();
const ee = new EE();

let pool = [];
let helpGuide = [
  '\n-------------------------------------------------------------\n',
  '\n>>> cmd: \'@all <msg>\' to send a message to all\n',
  '\n>>> cmd: \'@dm <name> <msg>\' to private message user\n',
  '\n>>> cmd: \'@nickname <name>\' to change your name\n',
  '\n>>> cmd: \'@exit\' to exit chat room\n',
  '\n-------------------------------------------------------------\n',
];

ee.on('default', function(client) {
  client.socket.write('not a command \n');
});

ee.on('@help', function(client) {
  helpGuide.forEach( helpCommand => {
    client.socket.write(helpCommand);
  });
});

ee.on('@:)', function(client) {
  pool.forEach( c => {
    c.socket.write(`${client.nickname}: (╯°□°）╯︵ ┻━┻\n`);
  });
});

ee.on('@all', function(client, string) {
  pool.forEach( c => {
    c.socket.write(`${client.nickname}: ${string} \n`);
  });
});
// Set this up to store the inputs of nickname and message for the DM function
ee.on('@dm', function(client, string) {
  let nickname = string.split(' ').shift().trim();
  let message = string.split(' ').slice(1).join(' ').trim();
  //this will iterate over the pool array to match the inputed nickname within the pool
  pool.forEach( c => {
    if (c.nickname === nickname || c.id === nickname) {
      c.socket.write(`DM from ${client.nickname}: ${message} \n`);
    }
  });
});


ee.on('@exit', function(client) {
  let newPool = [];

  pool.forEach( el => {
    if ( client.id !== el.id) {
      newPool.push(el);
      el.socket.write(`${client.nickname} has left the chat! \n`);
    }
  });
  pool = newPool;

  client.socket.end();
});

ee.on('@nickname', function(client, string) {
  client.nickname = string.split(' ').shift().trim();
});



server.on('connection', function(socket) {
  let client = new Client(socket);

  pool.forEach( el => {
    el.socket.write(`${client.nickname} has joined! \n`);
  });

  pool.push(client);
  //Just a nice welcome message to push to the user
  socket.write('\nWelcome to Shaun\'s Chat Room \n');
  socket.write('Type @help to see a list of available commands \n');

  socket.on('data', function(data) {
    const command = data.toString().split(' ').shift().trim();
    //I'm writting this command to help me write a custom event that whenever # is typed before something it will us toString
    //without needing to be in the function
    if (command.startsWith('@')) {
      ee.emit(command, client, data.toString().split(' ').splice(1).join(' '));
      return;
    }

    ee.emit('default', client, data.toString());
  });
});

server.on('error', err => {
  console.log(err);
});

server.listen(PORT, function() {
  console.log('Server Starting On:', PORT);
});
