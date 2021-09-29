import { Server } from "socket.io"

const port = process.env.PORT || 8900

const io = new Server(port, {
    cors:{
        origin: 'http://localhost:3000',
    },
})

var users = []  // user: { userId, username }


const addUser = (socketId, userId, username, avatar) => {
    if(!userId) return
    if(!users.some( user => user.userId === userId )){
        users.push({
            username, userId, socketId, avatar
        })
    }
}

const removeUser = socketId => {
    users = users.filter( user => user.socketId !== socketId )
}

const getUser = userId => {
    return users.find( e => e.userId === userId )
}


io.on("connection", socket => {
    //  when connect
    console.log('a user connected.')
    socket.on("addUser", (userId, username, avatar) => {
        addUser(socket.id, userId, username, avatar)
        io.emit("getUser", users)
    })

    //  send & get message:  client -> send msg to mongodb -> send to socket -> sclient
    socket.on('sendMsg', ( receiveId, message ) => {
        console.log('sending...')
        console.log(message.conversationId)
        const user = getUser(receiveId)
        if(user)
            io.to(user.socketId).emit("receiveMsg", message)
    })

    //  when disconnect
    socket.on("disconnect", () => {
        console.log("a user disconnected.")
        removeUser(socket.id)
        io.emit("getUser", users)
    })
})