TCP

Summary

IRC is a chat room application using a TCP server and native Node Module: Net. This program first creates a Client through a Client Constructor and uses NPM uuid to generate unique universal ids for each client. Clients have the ability to chat, change their name, and exit with shortcut commands.

Getting Started

Clone this repo and install via terminal using npm i to add dependencies. Once cloned, start server by running node server.js which will fire off TCP routing. If you have not set your port, it will default to PORT 8000.

To connect to the chat room, you will need an available IP Address as well as your defined PORT number. Using a separate terminal window, connect to Telnet using the following command:

telnet IPAddress PORT
In terminal, use @all to message all available parties. Use @help to see a list of available commands.
