'use strict';

//todos: require in all the modules for server setup

const net = require('net');
const EE = require('events').EventEmitter;
const ee = new EE();
const Client = require('./model/client');

const server = net.createServer();


let pool = [];

ee.on('default', (client, string)=>{
  client.socket.write(`Improperly formatted command: ${string.split(' ', 1)}\n`);
});

server.on('connection', socket => {
  let client = new Client(socket);
  console.log('client', client); //npm run start:watch then nodemon server.js //then in other terminal type-- nc localhost 3000, this will hang until...
  pool.push(client);
  pool.forEach(c => c.socket.write(`${client.nick} has joined the channel\n`));

  socket.on('data', data => { //dont forget to write socket.on.error and socket.on.close!!!
    let cmd = data.toString().split(' ').shift().trim();
    console.log(cmd);
    if(cmd === '@all') { //if the message is to everyone
      pool.forEach(c => c.socket.write(data.toString()));
    } else if(cmd ==='@nickname') {
      // pool.forEach(c => c.socket.write(data.toString()));
      client.nick = data.toString().split(' ').pop().trim();
      console.log('nickName', client.nick);
      console.log(pool);

    } else if(cmd === '@dm') {
      pool.forEach(function(c){
        if(c.nick === data.toString().split(' ').slice(1,2).pop()) {
          c.socket.write(`${client.nick} to ${data.toString()}`);

        } else if (cmd === '@exit'){
          pool.forEach(c => c.socket.write(`${client.nick} has left chat\n`));
          client.socket.end();
          delete this.client;
        } else {
          ee.emit('default', client, data.toString().split(' ').slice(1).join());
        }
      });
      socket.on('error', function(err) {
        console.log('Error in the Socket', (err));
        socket.destroy();
      });
      socket.on('disconnect', function () {
        delete this.client;
      });

    } else {
      ee.emit('default', client, data.toString().split(' ').slice(1).join());
    }
  });

  // socket.on('close',  => {
  //
  // });

  socket.on('error', function() {
    console.log('error');
  });

});


server.listen(3000, ()=> console.log('listening on port 3000'));
