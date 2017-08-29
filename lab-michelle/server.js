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

//Node docs suggest trying to catch uncaught exceptions through this type of thing? https://nodejs.org/api/events.html#events_class_eventemitter
process.on('error', (err) => {
  console.error('Darn, an error occured');
});

server.on('connection', socket => {
  let client = new Client(socket);
  // console.log('client', client)
  pool.push(client);
  pool.forEach(c => c.socket.write(`${client.nick} has joined the channel\n`));

  socket.on('data', data => {
    let cmd = data.toString().split(' ').shift().trim();
    console.log(cmd);

    if(cmd === '@all') {
      console.log(data.toString().split(' ').slice(1).join() + '\n');
      pool.forEach(c => c.socket.write(client.name + ' says ' + data.toString().split(' ').slice(1).join() + '\n'));

    } else if(cmd === '@nick') {
      let makeName = data.toString().split(' ').pop().trim();
      //FYI, credit to Isaac. Isaac explained how this works to me//
      client.nick = makeName;
      console.log(client.nick);
      pool.forEach(c => c.socket.write(`${client.nick} changed his name!`));

//Pair programmed with Said//
    } else if(cmd === '@dm') {
      let commandLineArr = data.toString().split(' ');
      // console.log(commandLineArr);
      // console.log('the 1 in cLArr', commandLineArr[1]);
      pool.forEach(client => {
        if (commandLineArr[1] === client.nick) {
          console.log(commandLineArr[2]);
          client.socket.write(commandLineArr[2]);
        }
      });
    }
  });

  //I'm trying to figure out what to do with errors but honestly I'm not sure//
  ee.on('error', (err) => {
    if (err) console.error('Alas, alack, an error!');
  });
  ee.emit('error', (err) => {
    if (err) console.error('A wild error appears!');
    socket.destroy(); //it says end in the readme and I feel like given end can still do stuff that can't be right
  });
});

server.listen(3000, () => console.log('listening on port 3000'));
