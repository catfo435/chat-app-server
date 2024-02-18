import express from "express"
import cors from "cors"

const PORT = 5000

const app = express()

const users = ["Rahul","Messi","Federer"]

app.use(cors())

app.get("/users", (req,res) => {
    res.json({users : users})
})

app.post("/users", (req,res) => {
    console.log(req.body)
})

app.listen(PORT,() => {
    console.log(`Server is running on ${PORT}`)
})
