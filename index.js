// Openweather API Key //
const apiKey = "9b416adf086fffbb0c564aa90f7624d8";
// Current Weather Info //
var currWeatherDiv = $("#currentWeather");
// Five Day Forcast Info //
var forecastDiv = $("#fiveDayForecast");
// City Array //
var citiesArray;
// so i can use ENTER to submit
$(document).ready(function () {
    $("#cityInput").keyup(function (event) {
        if (event.keyCode == 13) {
            $("#submitCity").click();
        }
    });
});

// City search when user clicks search icon
$("#submitCity").click(function () {
    event.preventDefault();
    let cityName = $("#cityInput").val();
    localStorage.setItem("currentCity", cityName)
    returnCurrentWeather(cityName);
    returnForecast(cityName);

});

// Previous cities show under search 
$("#previousCities").click(function () {
    let cityName = event.target.value;
    returnCurrentWeather(cityName);
    returnForecast(cityName);

})

// Local Storage functionality // 
if (localStorage.getItem("localWeatherSearches")) {
    citiesArray = JSON.parse(localStorage.getItem("localWeatherSearches"));
    let currentCity = localStorage.getItem("currentCity")
    writeSearchHistory(citiesArray);
    returnCurrentWeather(currentCity);
    returnForecast(currentCity);


} else {
    citiesArray = [];

};
// Creates history of recent searches 
function createHistoryButton(cityName) {
    var citySearch = cityName.trim();
    var buttonCheck = $(`#previousSearch > BUTTON[value='${citySearch}']`);
    if (buttonCheck.length == 1) {
        return;
    }

    if (!citiesArray.includes(cityName)) {
        citiesArray.push(cityName);
        localStorage.setItem("localWeatherSearches", JSON.stringify(citiesArray));
    }


    $("#previousSearch").prepend(`
    <button class="btn btn-light cityHistoryBtn" id="cityHistoryButton" value='${cityName}'>${cityName}</button>
        `);
}

// on click function to return current weather when clicking one of the buttons for a previous search
$(".cityHistoryBtn").on("click", function () {
    currWeatherDiv.empty();
    let cityName = $(this).val();
    returnCurrentWeather(cityName);
    returnForecast(cityName);


});

function writeSearchHistory(array) {
    $.each(array, function (i) {
        createHistoryButton(array[i]);
    })
}


function returnCurrentWeather(cityName) {
    let queryURL = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&units=imperial&APPID=${apiKey}`;

    // Get info from URL When searched
    $.get(queryURL).then(function (response) {
        // Current Date 
        let currTime = new Date(response.dt * 1000);
        // Displays Weather Icon 
        let weatherIcon = `https://openweathermap.org/img/wn/${response.weather[0].icon}@2x.png`;
        // When searched display info on Weather info
        currWeatherDiv.html(`
        <h2>${response.name}, ${response.sys.country} (${currTime.getMonth() + 1}/${currTime.getDate()}/${currTime.getFullYear()})<img src=${weatherIcon} height="75px"></h2>
        <p>Temperature: ${response.main.temp}&#176;F</p>
        <p>Humidity: ${response.main.humidity}%</p>
        <p>Wind Speed: ${response.wind.speed} mph</p>
        `, uvIndex(response.coord))
        createHistoryButton(response.name);
        localStorage.setItem("cityObject", JSON.stringify(response));
        console.log(response);
    })
};
// API call to retrieve the UV index, this is called in the "reutnrCurrentWeather" function.
function uvIndex(coordinates) {
    let queryURL = `https://api.openweathermap.org/data/2.5/uvi?lat=${coordinates.lat}&lon=${coordinates.lon}&APPID=${apiKey}`;

    $.get(queryURL).then(function (response) {
        let currUVIndex = response.value;
        // default green color for the UV index
        let uvStrength = "green";
        let textColor = "white"

        // based on the returned UV index, the color of the value will be set.
        if (currUVIndex >= 8) {
            uvStrength = "red";
            textColor = "white"
        } else if (currUVIndex >= 6) {
            uvStrength = "orange";
            textColor = "black"
        } else if (currUVIndex >= 3) {
            uvStrength = "yellow";
            textColor = "black"
        }
        currWeatherDiv.append(`<p>UV Index: <span class="text-${textColor}" style="background-color: ${uvStrength};">${currUVIndex}</span></p>`);
    })
}

// API call for the 5 day forecast
function returnForecast(cityName) {
    let queryURL = `https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&units=imperial&APPID=6c0ac38b22e3e819b50460a5a899f855`;

    $.get(queryURL).then(function (response) {
        let forecastInfo = response.list;
        console.log(response);
        forecastDiv.empty();
        $.each(forecastInfo, function (i) {
            if (!forecastInfo[i].dt_txt.includes("12:00:00")) {
                return;
            }
            //Forecast Dates
            let forecastDate = new Date(forecastInfo[i].dt * 1000);
            //displays icon
            let weatherIcon = `https://openweathermap.org/img/wn/${forecastInfo[i].weather[0].icon}.png`;
            // append data to div when searched
            forecastDiv.append(`
                <div class="card text-white bg-primary">
                    <div class="card-body">
                        <h6>${forecastDate.getMonth() + 1}/${forecastDate.getDate()}/${forecastDate.getFullYear()}</h6>
                        <img src=${weatherIcon} alt="Icon">
                        <p>Temp: ${forecastInfo[i].main.temp}&#176;F</p>
                        <p>Humidity: ${forecastInfo[i].main.humidity}%</p>
                    </div>
                </div>
            </div>
            `)
        })
    })
};
