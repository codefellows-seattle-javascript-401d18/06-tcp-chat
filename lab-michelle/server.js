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
      pool.forEach(c => c.socket.write(data.toString().split(' ').slice(1).join() + '\n'));

    } else if(cmd === '@nick') {
      let makeName = data.toString().split(' ').pop().trim();
      //FYI, credit to Isaac. Isaac explained how this works to me//
      client.nick = makeName;
      console.log(client.nick);
      pool.forEach(c => c.socket.write(`${client.nick} changed his name!`));

    } else if(cmd === '@dm') {
      let commandLineArr = data.toString().split(' ');
      console.log(commandLineArr);
      console.log('the 1 in cLArr', commandLineArr[1]);
      pool.forEach(client => {
        if (commandLineArr[1] === client.nick) {
          console.log(commandLineArr[2]);
          client.socket.write(commandLineArr[2]);
        }
      });
    }
  });

 ee.emit('error', )
  socket.destroy('data', data =>
    ee.emit('error', )
);
    ee.emit('default', client, data.toString().split(' ').slice(1).join())
  //when a socket emits the close event, the socket should be removed from the client pool, and the socket should be ended
  Event: 'close'#
  Added in: v0.1.90
  had_error <boolean> true if the socket had a transmission error.
  Emitted once the socket is fully closed. The argument had_error is a boolean which says if the socket was closed due to a transmission error.
  socket.on('end', )

});

server.listen(3000, () => console.log('listening on port 3000'));
