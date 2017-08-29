# Lab 6

## Description
This chat API allows you to create multiple users, set a nickname for each user, send @all messages to the group, and send @dm messages at users.

## Installation
I'm assuming someone can just copy this off of my Github?

- clone or download github repo
- initialize npm: `npm init`
- install uuid package for Node (`npm install uuid`);
- set up dev dependencies: jest, eslint

## How to connect to the server
- run nodeserver.js
- if testing with a Windows machine, test through telnet and PuTTY with host name set to localhost 3000 and a connection type of telnet
  - [download PuTTY here](https://www.chiark.greenend.org.uk/~sgtatham/putty/latest.html)
  - if you haven't configured telnet previously, do so using these instructions [here](http://www.sysprobs.com/install-and-enable-telnet-in-windows-8-use-as-telnet-client)
- instantiate users through PuTTY terminals

## Features
+ Chat!
+ Give yourself a nick name: Instead of keeping the random name generated, you can rename yourself in the channel.
`@nick yourname` will rename your user to your preferred nickname
+ Send messages to a group:
`@all yourmessagehere` will send a message to the entire group in the chat
+ Send a direct message (dm):
`@dm username messagetothem` will send a direct message to the username you specify. Right now the message has to be all one word (separate by _ or -s), hoping to fix this issue in v2.0 (aka lab resubmit).
