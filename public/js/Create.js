var input = document.querySelector('input[name=basic]');

var today = new Date();
var CurrentDate = today.getFullYear() + '-' +'0'+ (today.getMonth() +1) + '-' + today.getDate();

var startdate = document.getElementById("StartDate")
startdate.setAttribute("value",CurrentDate)
startdate.setAttribute("min",CurrentDate)

var StartDateValue = document.getElementById('StartDate')

//When start date is changed end date is automatically set 4 days later
StartDateValue.addEventListener('change', () => {
    var FourAdditionDays = new Date(new Date(StartDateValue.value).getTime()+3*24*60*60*1000);
    var EndCurrentDate = FourAdditionDays.getFullYear() + '-' +'0'+ (FourAdditionDays.getMonth() +1) + '-' + FourAdditionDays.getDate();
    
    var enddate = document.getElementById("EndDate")
    enddate.setAttribute("value",EndCurrentDate)
    enddate.setAttribute("min",EndCurrentDate)
})


