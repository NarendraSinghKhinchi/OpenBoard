const express = require('express');
const socket = require('socket.io');
const app = express();
const port = 3000 ;

app.use(express.static("public"));

app.get('/' , (req , res)=>{
    res.send("hello World from app js");
})
// app.get('/index.html' , (req , res)=>{
//     res.sendFile(");
// })
const server = app.listen(port , ()=>{
    console.log("server started on port 3000");
})

const io = socket(server);
io.on("connection" ,(socket)=>{
 console.log("new user connected");

    socket.on("drawingStarted" , data=>{
        io.sockets.emit("drawingStarted" , data);
    })
    socket.on("penMoving" , data=>{
        io.sockets.emit("penMoving" , data);
    })
    socket.on("drawingComplete" ,()=>{
        io.sockets.emit("drawingComplete");
    })
    socket.on("undo" ,()=>{
        io.sockets.emit("undo");
    })
    socket.on("redo" , ()=>{
        io.sockets.emit("redo");
    })
    socket.on("configChang" , data=>{
        io.sockets.emit("configChang" , data);
    })
});  