'use-strict';

const uuid = require('uuid/v4');

module.exports = function(socket) {
  this.socket = socket;
  this.nickName = `guest_${Math.random() * 10000}`;
  this._id = uuid();
};
