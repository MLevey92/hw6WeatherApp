var APIKey = "ed7c52f35ab9c16faf66198f338f6a48";
var searchBtn = $('#searchBtn');
var cityInput = $('#cityInput');
var results = $('#results');
var current = $('#current');
var forecast = $('#forecast');



function renderCurrent (city) {
    current.empty();

    var queryURL = "http://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=" + APIKey + "&units=imperial";

    fetch(queryURL)
    .then(function(response) {
        return response.json();
    })
    .then(function(data) {
        //console.log(data);
        
        //render current weather box
        var titleEl = $('<h1>');
        titleEl.text(data.name);

        var tempEl = $('<p>');
        tempEl.text('Temp: ' + data.main.temp + " °F");

        var windEl = $('<p>');
        windEl.text('Wind: ' + data.wind.speed + " MPH");

        var humEl = $('<p>');
        humEl.text('Humidity: ' + data.main.humidity);

        current.append(titleEl);
        current.append(tempEl);
        current.append(windEl);
        current.append(humEl);
        current.addClass("border p-2 m-2");

        var lat = data.coord.lat;
        var lon = data.coord.lon;
        console.log("lat: " + lat + "lon: " + lon);

        var queryURL2 = "api.openweathermap.org/data/2.5/forecast?lat=" + lat + "&lon=" + lon + "&appid=" + APIKey;
        //5 day forecast call; only takes lat and lon
        fetch(queryURL2)
        .then(function(response) {
            return response.json();
        })
        .then(function(data) {
            console.log(data);
        });

    });

}

function handleSearch(e) {
    e.preventDefault();

    var city = cityInput.val();
    renderCurrent(city);

    
}

searchBtn.on('click', handleSearch);