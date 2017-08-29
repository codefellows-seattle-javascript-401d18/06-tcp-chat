# 401 Lab-06 Documentation

When the user connects to the chat room, there are 3 commands they can run.

The first command they can run is the `@all` command. When you write `@all`, you can add the text you want the channel to see, and it will show all users your message. An example of sending a message globally to the whole channel would be `@all hello world!`. This would return the message hello world for everyone to see.

The second command they can run is the `@nick` command. When you first connect to the chat room, you will be assigned a random number for your username. You can alter this by running `@nick`, followed by the nickname of your choosing. An example of changing a user named user123 to exampleuser would simply be `@nick exampleuser`. When you change your nickname, the channel is notified of the name change.

The final command the user can run is the `@dm` command. By typing in `@dm`, followed by the username of the person they are trying to direct message, and after the username the message itself, you can directly message a specific user without having it display globally to the channel. A written example to reach a user named exampleuser would be `@dm exampleuser the message example user will see`.

When you exit the chat room, the channel will be informed that your username has logged out. When you log back in, you will again be randomly assigned a username with a number.
