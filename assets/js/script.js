var APIKey = "ed7c52f35ab9c16faf66198f338f6a48";
var searchBtn = $('#searchBtn');
var cityInput = $('#cityInput');
var results = $('#results');
var current = $('#current');
var forecast = $('#forecast');
var historyEl = $('#history');
var clearHistoryBtn = $('#clearHistory');

var lat;
var lon;

var searchHistory = [];

//get cities from localstorage and render history
loadHistory();
renderHistory();

//loads history array. reverses it so that recent is at the top
function loadHistory () {
    var localGet = localStorage.getItem("cities");
    if (localGet !== null) {
        searchHistory = localGet.split(",");
        searchHistory = searchHistory.reverse();
    }
}

//Renders history div. limits to 10 buttons
function renderHistory () {
    historyEl.empty();
    
    if (searchHistory.length<10) {
        for (i=0;i<searchHistory.length;i++) {
            var buttonEl = $('<button>');
            buttonEl.text(searchHistory[i]);
            buttonEl.addClass('btn btn-outline-secondary container-fluid m-1');
            historyEl.append(buttonEl);
        }
    } else
        for (i=0;i<5;i++) {
            var buttonEl = $('<button>');
            buttonEl.text(searchHistory[i]);
            buttonEl.addClass('btn btn-outline-secondary container-fluid m-1');
            historyEl.append(buttonEl);
        }
    
}


function renderCurrent (city) {
    current.empty();

    var queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=" + APIKey + "&units=imperial";

    fetch(queryURL)
    .then(function(response) {
        return response.json();
    })
    .then(function(data) {
        
        //render current weather box
        var titleEl = $('<h1>');
        titleEl.text(data.name);

        var tempEl = $('<p>');
        tempEl.text('Temp: ' + data.main.temp + " °F");

        var windEl = $('<p>');
        windEl.text('Wind: ' + data.wind.speed + " MPH");

        var humEl = $('<p>');
        humEl.text('Humidity: ' + data.main.humidity + " %");

        current.append(titleEl);
        current.append(tempEl);
        current.append(windEl);
        current.append(humEl);
        current.addClass("border p-2 m-2");
        
        lat = data.coord.lat;
        lon = data.coord.lon;
        

        var queryURL2 = "https://api.openweathermap.org/data/2.5/forecast?lat=" + lat + "&lon=" + lon + "&appid=" + APIKey + "&units=imperial";
        //5 day forecast call; only takes lat and lon
        
        fetch(queryURL2)
        .then(function(response) {
            return response.json();
        })
        .then(function(data) {
            //render 5-day forecast
            forecast.empty();

            var titleEl = $('<h1>');
            titleEl.text("5-Day Forecast");
            forecast.append(titleEl);
            for (var i=0;i<data.list.length;i+=8) {
                var divEl = $('<div>');

                var iconEl = $('<img>');
                var iconID = data.list[i].weather[0].icon;
                iconEl.attr("src", "http://openweathermap.org/img/wn/"+ iconID + ".png");

            

                var dateEl = $('<h6>');
                var date = data.list[i].dt_txt.split(" ");
                dateEl.text(date[0]);

                var tempEl = $('<p>');
                tempEl.text('Temp: ' + data.list[i].main.temp + " °F");

                var windEl = $('<p>');
                windEl.text('Wind: ' + data.list[i].wind.speed + " MPH");

                var humEl = $('<p>');
                humEl.text('Humidity: ' + data.list[i].main.humidity + " %");

                divEl.append(dateEl);
                divEl.append(iconEl);
                divEl.append(tempEl);
                divEl.append(windEl);
                divEl.append(humEl);

                divEl.addClass('panel border p-2 m-2 col-lg-2');

                forecast.append(divEl);
            }
        });
        
        

    });

    
}

//Gets city input, pushes to local storage history
function handleSearch(e) {
    e.preventDefault();

    var city = cityInput.val();

    if (city !== "") {
        //push to local storage if not already there, add to search history and re-render history
        if (!searchHistory.includes(city)) {
            searchHistory.unshift(city);
        }
        localStorage.setItem("cities", searchHistory);
        renderHistory();

        renderCurrent(city);
    }
    
  

    
}

//search button listener
searchBtn.on('click', handleSearch);

//clear button
clearHistoryBtn.on('click', function () {
    localStorage.clear();
    searchHistory = [];
    renderHistory();
    historyEl.empty();
})

//user clicks on button to populate search bar from history
historyEl.on('click', '.btn', function (e) {
    renderCurrent(e.target.innerHTML);
})