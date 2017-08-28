//require in uuid
//we will take advantage of the net module in node - we will also use some event emitters
//uuid is an almost completely unique id


'use strict'
const uuid = require('uuid/v4')

//TODO: Client needs a nickname, _id, and socket - this is what the server will hand off

model.exports = function(socket){
  this.socket = socket
  this.neck = `guest_${Math.random() * 10000}`
  this._id = uuid()
}
