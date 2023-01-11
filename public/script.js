let menu_cont = document.querySelector(".menu-cont");
let top_cont = document.querySelector(".top-cont");
let pen_options = document.querySelector(".pen-options");
let eraser_options = document.querySelector(".eraser-options") ;
let pen_cont = document.querySelector(".pen-cont");
let eraser_cont = document.querySelector(".eraser-cont");
let sticky_note_cont = document.querySelector(".sticky-note-cont");
let sticky_cont = document.querySelector(".sticky-cont");
let upload_cont = document.querySelector(".upload-cont");

basic_functionality();
stickyNotes();
upload();
// dragElement(top_cont);
function basic_functionality(){
    // this function will be called to set pages  basic default settings
    // hiding and showing things 
    let menu = true ;
    let pen_options_visible = false ;
    let eraser_options_visible = false ;
    menu_cont.addEventListener("click" , e=>{
        const icons = menu_cont.querySelectorAll(".fa-solid");
        if(menu){
            icons[0].classList.remove("visible");
            icons[1].classList.add("visible");
            top_cont.style.display = "none" ;
            pen_options.style.display = "none" ;
            eraser_options.style.display = "none";
            pen_options_visible = false ;
            eraser_options_visible = false ;
        }else{
            icons[1].classList.remove("visible");
            icons[0].classList.add("visible");
            top_cont.style.display = "flex";
        }
        menu = !menu ;
    })
    pen_cont.addEventListener("click" , e=>{
        if(pen_options_visible)
            pen_options.style.display = "none" ;
        else pen_options.style.display = "flex" ;
        pen_options_visible = !pen_options_visible ;
    })
    eraser_cont.addEventListener("click" , e=>{
        if(eraser_options_visible)
            eraser_options.style.display = "none";
        else eraser_options.style.display = "flex";
        eraser_options_visible = !eraser_options_visible ;
    })
}
function stickyNotes(){
    sticky_cont.addEventListener("click" , e=>{
        let newsticky = createNewSticky();
        document.body.appendChild(newsticky);
    })

    // function createNewSticky(){
    //     const div = document.createElement("div");
    //     div.className = "sticky-note-cont" ;
    //     div.innerHTML = `
    //         <div class="sticky-controls" >
    //             <div class="minimize green">
    //                 <i class="fa-sharp fa-solid fa-down-left-and-up-right-to-center"></i>
    //             </div>
    //             <div class="remove cadetblue">
    //                 <i class="fa-sharp fa-solid fa-xmark "></i>
    //             </div>
    //         </div>
    //         <div class="sticky-note">
    //             <textarea name="" id="" cols="20" rows="11" spellcheck="false"></textarea>
    //         </div>
    //     `
        
    //     const remove = div.querySelector(".remove");
    //     const minimize = div.querySelector(".minimize");
    //     addListeners(remove , minimize , div);        
    //     // div.addEventListener("dblclick" ,e=>{
    //         dragElement(div);
    //     // })
    //     return div ;
    // }
}
function createNewSticky(){
    function addListeners(remove , minimize , sticky){
        let noteVisible = true;
        remove.addEventListener("click" , e=>{
            sticky.remove();
        });
        minimize.addEventListener("click",e=>{
            const note = sticky.querySelector(".sticky-note");
            if(noteVisible)
                note.style.display = "none";
            else note.style.display = "block";
            noteVisible = !noteVisible ;
        });
        
    }
    const div = document.createElement("div");
    div.className = "sticky-note-cont" ;
    div.innerHTML = `
        <div class="sticky-controls" >
            <div class="minimize green">
                <i class="fa-sharp fa-solid fa-down-left-and-up-right-to-center"></i>
            </div>
            <div class="remove cadetblue">
                <i class="fa-sharp fa-solid fa-xmark "></i>
            </div>
        </div>
        <div class="sticky-note">
            <textarea name="" id="" cols="20" rows="11" spellcheck="false"></textarea>
        </div>
    `
    
    const remove = div.querySelector(".remove");
    const minimize = div.querySelector(".minimize");
    addListeners(remove , minimize , div);        
    // div.addEventListener("dblclick" ,e=>{
        dragElement(div);
    // })
    return div ;
}
function upload(){
    upload_cont.addEventListener("click" , e=>{
        const input = document.createElement("input");
        input.type = "file" ;
        input.click();
        input.onchange = (event) => {
            const selectedFile = input.files[0];
            let url = URL.createObjectURL(selectedFile);
            const newsticky = createNewSticky();
            const sticky_note = newsticky.querySelector("textarea");
            sticky_note.style.backgroundImage = `url(${url})`
            document.body.appendChild(newsticky);
        }
    });
}
function dragElement(elmnt) {
    var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
    elmnt.onmousedown = dragMouseDown;

    function dragMouseDown(e) {
      e = e || window.event;
      const tag = e.target.tagName ;
      if(tag === "TEXTAREA")return ;
      e.preventDefault();
      // get the mouse cursor position at startup:
      pos3 = e.clientX;
      pos4 = e.clientY;
      document.onmouseup = closeDragElement;
      // call a function whenever the cursor moves:
      document.onmousemove = elementDrag;
    }
  
    function elementDrag(e) {
      e = e || window.event;
      e.preventDefault();
      // calculate the new cursor position:
      pos1 = pos3 - e.clientX;
      pos2 = pos4 - e.clientY;
      pos3 = e.clientX;
      pos4 = e.clientY;
      // set the element's new position:
      elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
      elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
    }
  
    function closeDragElement() {
      // stop moving when mouse button is released:
      document.onmouseup = null;
      document.onmousemove = null;
    }
}
