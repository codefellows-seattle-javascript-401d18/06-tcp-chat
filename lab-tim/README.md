# Lab 06 - TCP Chat Server
# Tim Turner
=====================================

# Description

This app is a TCP chat server.  You can use it to chat with other people.  You can chat with all users, or to a specific user.  You can also change your nickname to whatever you want.

To run the server, you must have nodejs installed.  You also have to run npm install to download the npm required modules.  After you have those done, type "node server.js" in the terminal window.  The server will now be running.

To connect to the server, you can telnet to localhost:3000.  This server will only work locally for now.  Once connected, use the commands below:
 @nick "new nickname" to change your nickname
 @all "message here" to chat to all users
 @dm "username" "message here" to send a direct message to a user

  typing control + C will disconnect you from the server
