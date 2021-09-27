import { Server } from "socket.io"
const io = new Server(8900, {
    cors:{
        origin: 'http://localhost:3000',
    },
})

var users = []
const addUser = (socketId, userId) => {
    if(!userId) return
    if(!users.some( user => user.userId === userId ))
        users.push({
            userId, socketId
        })
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
    socket.on("addUser", userId => {
        console.log(userId)
        addUser(socket.id, userId)
        io.emit("getUser", users)
    })

    //  send & get message:  client -> send msg to mongodb -> send to socket -> sclient
    socket.on('sendMsg', data => {
        const { receiveId, message } = data
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