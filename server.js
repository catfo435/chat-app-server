import { Server } from "socket.io";
import { createServer } from "http";
import express from "express";
import cors from "cors"
import pg from 'pg'
import bodyParser from 'body-parser';

const db = new pg.Pool({
    user: 'postgres',
    password: 'postgres',
    host: 'localhost',
    port: 5432,
    database: 'chatapp'
});

const app = express()

const corsOptions = {
    origin : "http://localhost:3000",
    optionsSuccessStatus: 200
}

app.use(cors(corsOptions))
app.use(bodyParser.json())

const httpServer = createServer(app);
const io = new Server(httpServer,{
    cors : corsOptions
});

io.use((socket, next) => {
    const username = socket.handshake.auth.username;
    socket.id = username;
    next();
  });

io.on("connection", socket => {
    console.log(`User ${socket.handshake.auth.username} connnected`);

    socket.on("message", async ({ message,sender,receiver}) => {
        await db.query(`INSERT INTO transaction01(message,sender,receiver) VALUES($1,$2,$3)`,[message,sender,receiver])
        socket.to(receiver).emit("message", {
          message,
          sender,
          receiver
        });
      });

})



app.get("/messages", async (req,res) => {
    try {
        const result = await db.query(`SELECT * FROM transaction01`)
        res.status(200).send({messages:result.rows})
      } 
    catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
    }
})

app.post("/users/login", async (req,res) => {

    try {
        const result = await db.query(`SELECT * FROM users WHERE username = $1::text`,[req.body.username])
        if (result.rows[0] && result.rows[0].pass == req.body.password) res.status(200).send("Authentication approved!")
        else res.status(401).send("Authentication Error")
      } 
    catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
    }
})

app.post("/users", async (req,res) => {

    res.status(501).send("Not Implemented Yet")
    return; // until user addition "+" is implemented

    try {
        await db.query(`INSERT INTO users(username,pass,secret) VALUES($1,$2,$3)`,[req.body.username,req.body.password,"abcd"])
        res.status(200).send("Account Made!")
      } 
    catch (err) {
        console.error(err);
        if (err.code == '23505') res.status(403).send('Username already exists')
        else res.status(500).send('Internal Server Error');
    }
})

httpServer.listen(4000,() => {
    console.log('Server listening on port 4000')
})