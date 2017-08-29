'use strict';

//todos: Client needs a nickName, _id, and a socket (TCP port?)

const uuid = require('uuid/v4');

module.exports = function(socket){
  this.socket = socket;
  this.nick = `guest_${Math.random() * 10000}`;
  this._id = uuid();
};
