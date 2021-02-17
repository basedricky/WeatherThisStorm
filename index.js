// Openweather API Key //
const apiKey = "9b416adf086fffbb0c564aa90f7624d8";
// Current Weather Info //
var currWeatherDiv = $("#currentWeather");
// Five Day Forcast Info //
var forecastDiv = $("#forecast");
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
    returnCurrentWeather(cityName);
});

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
        `, returnUVIndex(response.coord))
    })
};
// API call to retrieve the UV index, this is called in the "reutnrCurrentWeather" function.
function returnUVIndex(coordinates) {
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
        currWeatherDiv.append(`<p>UV Index: <span class="text-${textColor} uvPadding" style="background-color: ${uvStrength};">${currUVIndex}</span></p>`);
    })
}