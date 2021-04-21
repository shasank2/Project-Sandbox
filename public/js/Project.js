// Code for project dorp down structure
const itemSelecter = document.querySelectorAll(".down-icon")
itemSelecter.forEach(item =>{
    item.addEventListener("click",event =>{
        const activeItem = document.querySelector(".down-icon.active");
        if(activeItem && activeItem!==item){
            activeItem.classList.toggle("active");
            activeItem.nextElementSibling.style.maxHeight = null;
        }

        item.classList.toggle("active");
        const expContent = item.nextElementSibling;
        if(item.classList.contains("active")){
            expContent.style.maxHeight = expContent.scrollHeight + "px";
        } else{
            expContent.style.maxHeight = null;
        }
    });
});