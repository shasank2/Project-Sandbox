const tabs = document.querySelectorAll('[data-tab-target]')
const tabContents = document.querySelectorAll('[data-tab-content]')

tabs.forEach(tab =>{
    tab.addEventListener('click', ()=>{
        const target = document.querySelector(tab.dataset.tabTarget)

        tabContents.forEach(tabContents => tabContents.classList.remove('active'))

        tabs.forEach(tabItem => tabItem.classList.remove('active'))

        tab.classList.add('active')
        target.classList.add('active')
    })
})

//Variable for storing active div
var selectedTab = ''
//Active div checker
function checkActive() {
    tabs.forEach(tab =>{
        if (tab.classList.contains('active')){
            selectedTab = tab.innerHTML
            $.ajax({
                type:'POST',
                url: '/Methodologies',
                data : {selectedTab},
                success: function(data){
                    window.location='/Kanban'
                }
            })
            
        }
    })
}


//For back button
function Back() {
  window.history.back();
}
