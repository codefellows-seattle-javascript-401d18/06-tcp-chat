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

server.on('connection', socket => {
  let client = new Client(socket);
 // console.log('client', client)
  pool.push(client);
  pool.forEach(c => c.socket.write(`${client.nick} has joined the channel\n`));
  socket.on('error', (error) => {console.error(error);});
  socket.on('close', () => {
    let index = pool.indexOf(client);
    pool.slice(index, 1);
    pool.forEach(c => c.socket.write(`${client.nick} has left the channel\n`));
  });
  socket.on('data', data => {
    let cmd = data.toString().split(' ').shift().trim();
    console.log(cmd);
    if(cmd === '@all') {
      // console.log(data.toString().split(' ').slice(1).join() + '\n');
      pool.forEach(c => c.socket.write(`${client.nick}` + data.toString()));
    } else if(cmd === '@nick') {
      pool.forEach(c => c.socket.write(`${client.nick} is now : ${data.toString()}\n`));
      client.nick = data.toString().split(' ').slice(1,2).join().trim();
    }
    else if(cmd === '@dm') {
      let dmUser = data.toString().split(' ').slice(1,2).join();
      pool.forEach(function(c) {
        if (c.nick === dmUser ) {
          c.socket.write(`${client.nick} : ${data.toString()}`);
        }
      });
    }
  });
});
  //     })
  //   }
  // })

   // console.log(data.toString()) => will print whatever data was transmitted


server.listen(3003, () => console.log('listening on port 3003'));
