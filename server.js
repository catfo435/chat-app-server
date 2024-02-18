import { WebSocketServer } from "ws";
const server = new WebSocketServer({ port : "5000" })

server.on("connection", socket => {
    console.log("user connnected");
    socket.on("message", message => {
        socket.emit(message.toString())
    })
})