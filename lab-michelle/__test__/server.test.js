'use strict';

const server = require('../server');
const net = require('net');
require('jest');

describe('Server instance', function() {
  //setting up our after all block so we close the server when we are done with tests//
  afterAll(done => {
    server.close();
    done();
  });

  describe('new client joins chat', ()=> {
    test('notify that a user joined', done => {
      let client = net.connect({port: 3000}, () => {
        client.on('data', data => {
          expect(data.toString()).toContain('appears');
          client.end();
          done();
        });
      });
    });
    test('should write hellooo from client 1 to 2', done => {
      let client1 = net.connect({port:3000}, ()=> {
        client1.on('data', data => {
          console.log(data.toString());
          if(!data.toString().includes('appears')) {
            expect(data.toString()).toMatch(/hellooo/);
          }
        });
      });
      let client2 = net.connect({port: 3000}, ()=> {
        client2.write('@all hellooo', ()=> {
          client1.end();
          client2.end();
          done();
        });
      });
    });
  });
});
