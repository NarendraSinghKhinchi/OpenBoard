let canvas = document.querySelector(".canvas");
let pen_colors = document.querySelectorAll(".pen-color");
let Width_Selector = document.querySelector("#penWidth");
let erasWidthSelect = document.querySelector("#eraserWidth");
let download_cont = document.querySelector(".download-cont");
let redo_cont = document.querySelector(".redo-cont");
let undo_cont = document.querySelector(".undo-cont");
// default styles/configurations
var ctx ;
// let penColor = "white" ;
// let penWidth = 3 ;
// let eraserWidth = 3;
// let eraserColor = "rgb(152, 154, 156)";
// let cursorWidth = 3 ;
// let cursorColor = penColor ;
const configurations = {
    penColor : "white" ,
    penWidth : 3,
    eraserWidth : 3,
    eraserColor: "rgb(152, 154, 156)",
    cursorWidth:3,
    cursorColor:"white" 
}
const undoredo = [] ;
let tracker = -1 ;

setCanvas();
function setCanvas(){
    canvas.width = window.innerWidth ;
    canvas.height = window.innerHeight ;
    ctx = canvas.getContext("2d");
    // beginPath => start drawing at the point where the pen currently is
    // moveTo => move the pen to new location
    // fill +> draw a filled shape by filling in the path travelled so far
    // stroke => drawn an outline shape by drawing a stroke along the path you've drawn so far
    // features => lineWidth, fillStyle / StrokeStyle
    ctx.strokeStyle = configurations.cursorColor ;
    ctx.lineWidth = configurations.cursorWidth ;
}

let drawing = false ;
function locatePen(coordinateObj){
    if(!drawing){
        drawing = true ;
        ctx.beginPath();
        ctx.moveTo(coordinateObj.x , coordinateObj.y);
    }
}
function draw(coordinateObj){
    if(drawing){
        canvas.style.cursor = "pointer"; // user starts he fill like he drawing from tip of his finger stop drawing make cursor arrow again
        ctx.strokeStyle = configurations.cursorColor ;
        ctx.lineWidth = configurations.cursorWidth ;
        ctx.lineTo(coordinateObj.x , coordinateObj.y);
        ctx.stroke();
    }
}
function finishDrawing(){
    canvas.style.cursor = "default" ;
    drawing = false ;
    const url = canvas.toDataURL();
    undoredo.push(url);
    tracker = undoredo.length - 1 ; 
}
canvas.addEventListener("mousedown", e=>{
    const data = {
        x : e.clientX ,
        y : e.clientY
    }
    locatePen(data);
    socket.emit("drawingStarted" , data); // sending data to server
})
canvas.addEventListener("mousemove" , e=>{
    if(drawing){
        const data = {
            x : e.clientX ,
            y : e.clientY
        }
        draw(data);
        socket.emit("penMoving" , data);
    }
})
canvas.addEventListener("mouseup" , e=>{
    finishDrawing();
    socket.emit("drawingComplete");
})


let erasing = false ;
eraser_cont.addEventListener("click" , e=>{
    erasing = !erasing ;
    if(erasing){
        configurations.cursorColor = configurations.eraserColor ;
        configurations.cursorWidth = configurations.eraserWidth ;
    }else{
        configurations.cursorWidth  = configurations.penWidth ;
        configurations.cursorColor = configurations.penColor ;
    }
    socket.emit("configChang" , configurations);
})
erasWidthSelect.addEventListener("click" , e=>{
    configurations.eraserWidth = e.target.value ;
    if(erasing)configurations.cursorWidth = configurations.eraserWidth ;
    socket.emit("configChang" , configurations);
})


undo_cont.addEventListener("click", e=>{
    unDo();
    socket.emit("undo");
});
function unDo(){
    if(tracker >= 0){
        tracker-- ;
        ctx.fillStyle = "rgb(152, 154, 156)" ;
        ctx.fillRect(0 , 0 , canvas.width , canvas.height);
        if(tracker == -1)return ;
        let url = undoredo[tracker] ;
        // let img = new Image();// new image reference element
        const img = document.createElement("img");
        img.src = url ;
        img.onload = e=>{
            ctx.drawImage(img , 0 , 0 , canvas.width , canvas.height);
        }
    }
}
redo_cont.addEventListener("click" , e=>{
    reDo();
    socket.emit("redo");
});
function reDo(){
    if(tracker+1 < undoredo.length){
        tracker++ ;
        ctx.fillStyle = "rgb(152, 154, 156)";
        ctx.fillRect(0 , 0 , canvas.width , canvas.height);
        let url = undoredo[tracker] ;
        let img = new Image();// new image reference element
        img.src = url ;
        img.onload = e=>{
            ctx.drawImage(img , 0 , 0 , canvas.width , canvas.height);
        }
    }
}


pen_colors.forEach(colorBtn =>{
    colorBtn.addEventListener("click" , e=>{
        configurations.cursorColor = e.target.classList[0];
        configurations.penColor = e.target.classList[0];
        socket.emit("configChang" , configurations);
    })
})
Width_Selector.addEventListener("click" ,e=>{
    configurations.penWidth = e.target.value ;
    configurations.cursorWidth = e.target.value ;
    socket.emit("configChang" , configurations);
})

download();
function download(){
    download_cont.addEventListener("click",e=>{
        let url = canvas.toDataURL();
        let a = document.createElement("a");
        a.href = url ;
        a.download = "board.jpg";
        a.click();
    })
}
// function degToRad(degrees) {
//     return degrees * Math.PI / 180;
// }

// this is the server communication code 
socket.on("drawingStarted" , data =>{ // data received from server
    locatePen(data);
})
socket.on("penMoving" , data=>{
    draw(data);
})
socket.on("drawingComplete" , ()=>{
    finishDrawing();
})
socket.on("undo",()=>{
    unDo();
})
socket.on("redo" , ()=>{
    reDo();
})
// configurations is a local object data is object from server below event triggers when a some other user
// changes the board configurations this happens so current users all configurations will also change
socket.on("configChang" , data=>{
    // configurations.penColor = data.penColor ;
    // configurations.penWidth = data.penWidth ;
    // configurations.eraserWidth = data.eraserWidth ;
    configurations.eraserColor = data.eraserColor ;
    configurations.cursorWidth = data.cursorWidth ;
    configurations.cursorColor = data.cursorColor ;
    erasWidthSelect.setAttribute("value" , configurations.cursorWidth);
})
