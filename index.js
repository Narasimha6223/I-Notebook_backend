const express = require('express')
const app = express()
const mongoconn = require('./db')
const cors = require('cors')


app.use(express.json())
app.use(cors())

mongoconn()

app.use('/api/auth' , require('./routes/auth'))
app.use('/api/notes' , require('./routes/notes'))


app.get('/',(req,res)=>{
    res.send({
        "Welcome":"Welcome to I-Notebook Backend!!",
        "Available - routes":{
            "Route - 1":"/api/auth",
            "Route - 2":"/api/notes",
        }
    })
})


app.listen(3000 , ()=>{
    console.log("Server Listening on port 3000");
})