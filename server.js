import { WebSocketServer } from "ws";
import express from "express";
import cors from "cors"
import pg from 'pg'
import bodyParser from 'body-parser';


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
    origin : "http://localhost:3000",
    optionsSuccessStatus: 200
}

app.use(cors(corsOptions))

app.get("/", async (req,res) => {
    res.send("API!")
})

app.post("/authenticate",bodyParser.json(), async (req,res) => {

    try {

        const client = new pg.Client({
            user: 'postgres',
            password: 'postgres',
            host: 'localhost',
            port: 5432,
            database: 'postgres'
        });

        await client.connect()

        const result = await client.query(`SELECT * FROM users WHERE username = $1::text`,[req.body.username])
        if (result.rows[0] && result.rows[0].pass == req.body.password) res.status(200).send("Authentication approved!")
        else res.status(401).send("Authentication Error")

        await client.end()
      } 
    catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
    }
})

app.listen(4000,() => {
    console.log('Server listening on port 4000')
})