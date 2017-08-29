### Configuration  
Created my lab directory and included:  
* `.gitignore`  
* `.eslintrc.json`  
* `package.json`  
* `.eslintignore`  
* `README.md`  

#### Feature Tasks  
* created a TCP Server using the NodeJS native `net` module  
* created a `Client` Constructor  
* when sockets connect to the server, a new `Client` instance should be made
* all clients should have a unique `_id` property - this should come from the use of `uuid`
* when sockets are connected with the client pool they should be given event listeners for `data`, `error`, and `close` events
 * when a socket emits the `close` event, the socket should be removed from the client pool, and the socket should be `ended`
 * when a socket emits the `error` event, the error should be logged on the server
 * when a socket emits the `data` event, the data should be logged on the server and the commands below should be implemented

## Custom commands
* `@all` should trigger a broadcast event to all members  
* `@nickname` should allow a user change their nickname  
* `@dm` should allow a user to send a message directly to another user by nick name or by their guest id _(unique client id)_  
* when a user sends a message, their nickname should be printed  
