// variables for apikey, ol selector, and city namr array

var apiKey = "21ff2b7a91235ce5b1c54810441d9032";
var orderedList = document.querySelector("ol")
var cityArr = {};


var date = moment().format('ll');
var date1 = moment().add(1,'days').format("dddd ll");
var date2 = moment().add(2,'days').format("dddd ll");
var date3 = moment().add(3,'days').format("dddd ll");
var date4 = moment().add(4,'days').format("dddd ll");
var date5 = moment().add(5,'days').format("dddd ll");




$(`#city-1`).html(`<h4 class="font-weight-bold"> Date: ${date1} `)
$(`#city-2`).html(`<h4 class="font-weight-bold"> Date: ${date2} `)
$(`#city-3`).html(`<h4 class="font-weight-bold"> Date: ${date3} `)
$(`#city-4`).html(`<h4 class="font-weight-bold"> Date: ${date4} `)
$(`#city-5`).html(`<h4 class="font-weight-bold"> Date: ${date5} `)


$("#subBtn").on("click", function () {

    var cityName = $("#cityTxt").val();
    
    $("#current").addClass("border border-warning")
    
    getLocation(cityName);


});


function getLocation(cityName) {
    var apiURL = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${apiKey}`;
    $.ajax({
        type: 'GET',
        url: apiURL,
        datatype: 'JSON',
        success: function (apiData) {
            console.log(apiData)
            var lat = apiData.coord.lat;
            var lon = apiData.coord.lon;
           
            oneCallApi(lon, lat, cityName);
           
            var getCity = JSON.parse(localStorage.getItem("weatherAPI")) || []
            if( getCity.indexOf(cityName) === -1){
          
            getCity.push(cityName)
          
            localStorage.setItem('weatherAPI', JSON.stringify(getCity));
            }
            
            onLoad(getCity);
        },
        error: function (err) {
            $('#current').text(" Error Getting Location's Forecast!");

        }
    });



};

// Using the lon, lat, and city name from the get locaiton in the onecall locaiton to returnt he weather for the locaiton.
function oneCallApi(lon, lat, cityName) {
    // var dateEL = moment('ll').add('day', 1);
    // console.log(dateEL)
    var oneCall = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&appid=${apiKey}&units=imperial`;
    $.ajax({
        type: 'GET',
        url: oneCall,
        datatype: 'JSON',
        success: function (apiData) {  
            console.log(apiData);
            // adding the current temp detail to the current id div in HTML
            $("#current").html(`<h4 class="font-weight-bold ">${cityName}
                    <h3 class="mx-auto d-inline"> ${date}<h3>
                    <p class="mx-auto d-inline">Temp: ${apiData.current.temp}°F</p>
                    <p class="mx-auto d-inline">Humidity: ${apiData.current.humidity}</p>
                    <p class="mx-auto d-inline">Wind Speed: ${apiData.current.wind_speed} mph</p>
                    <img class="mx-auto d-inline" src="http://openweathermap.org/img/wn/${apiData.current.weather[0].icon}@2x.png"/>
                    
                    `)
            // looping the 5 day forecast to get the temp info
           
            for (let i = 1; i < 7; i++) {
               
                
                $(`#day-${i}`).html(`<p class="mx-auto p-2">Temp: ${apiData.daily[i].temp.day}°F  </p>                                                                                                                                                            
                <p class="mx-auto p-2">Humidity:  ${apiData.daily[i].humidity}  </p>
                <p class="mx-auto p-2 ">Wind Speed: ${apiData.daily[i].wind_speed}mph</p>
                <img class="mx-auto p-2" src="http://openweathermap.org/img/wn/${apiData.daily[i].weather[0].icon}@2x.png"/>
                `)

            }


        },
        error: function (err) {
            console.log("Error in getting oneCall API Data", err)
        }
    })

};
// Creating onload funciton to run when page is loaded
var onLoad = function () {
    // parse the local storage weatherAPI data
    var getCity = JSON.parse(localStorage.getItem("weatherAPI")) || []
    console.log(getCity)
    var blankHTML = ""
    // looping through the local storage data and showing it on the page.
    for (let i=0; i< getCity.length;i++){
        // clearing out local storage after its loaded.
        blankHTML += `<button class="previous">${getCity[i]}</button>`   
        
    }
    // clearing the city data on page to prevent duplication 
    $("#citySearch").html(blankHTML)

};

// adding onclcick to the local storage data on page.
$("#citySearch").on("click", ".previous",function(){
    var city = $(this).text()
    console.log(city)
    $("#current").addClass("border border-warning")
    // add the button txt value to search bar
    $("#cityTxt").val(city)
    // running the txt through the get location function
    getLocation(city);
})

onLoad();