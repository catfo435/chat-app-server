import { WebSocketServer } from "ws";
import express from "express";
import cors from "cors"

const server = new WebSocketServer({ port : "5000" })

server.on("connection", socket => {
    console.log("user connnected");
    socket.on("message", message => {
        server.clients.forEach((client) => {
            client.send(message.toString())
        })
    })
})

const app = express()

const corsOptions = {
    origin : "localhost",
    optionsSuccessStatus: 200
}

app.use(cors(corsOptions))

app.listen(4000,() => {
    console.log('Server listening on port 4000')
})