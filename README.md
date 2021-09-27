<h1 align="center"> SOCKET IO </h1>

## Socket server

- Send event to client ( USE `io` )
    - use `io.emit` => to send every client
    - use `io.to( SocketID ).emit` => to send one client
- Take event from client ( USE `socket.on` )
  
## Client

- Send event to server ( USE `socket.emit` )
- Take event to server ( USE `socket.on` )