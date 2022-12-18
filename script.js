//Creating variables for our api key
var APIKey = "a266515614e92e8c1b5fc45f921dbaa8";
var cities = []
console.log(cities)


function displayWeatherData(city) {

    var queryURL = "https://api.openweathermap.org/data/2.5/weather?" + "q=" + city + "&appid=" + APIKey;

    $.ajax({
            url: queryURL,
            method: "GET"
        })
        // putting data inside response.
        .then(function(response) {
            console.log(queryURL);
            console.log(response);

           
            var Farenheit = (response.main.temp - 273.15) * 1.80 + 32;

        

            var UnixTimestamp = (response.dt)
            var milliseconds = UnixTimestamp * 1000
            var dateObject = new Date(milliseconds)
    
            var humanDateFormat = dateObject.toLocaleDateString("en-US", { month: "numeric", day: "numeric", year: "numeric" })

            //getting the icon

            iconID = response.weather[0].icon

            //rendering Httml
            $(".city-date").text(city + " " + humanDateFormat)
            $("#temp").text("Temperature: " + Farenheit.toFixed(2) + " °F");
            $("#humidity").text("Humidity: " + response.main.humidity + " %")
            $("#windspeed").text("Wind Speed: " + response.wind.speed + " MPH")
            $("#UV-index").text("UV-Index: ")

            // setting attributes: 
            $(".icon").attr("src", " https://openweathermap.org/img/wn/" + iconID + ".png")

            /* get the UV index and set the text)  nest ajax. use then function that says. pull weather report .then calculatethe UV index*/
            var lat = response.coord.lat;
            var lon = response.coord.lon;
            console.log(lat)
            console.log(lon)
                //set UV index ajax
            $.ajax({
                    url: "https://api.openweathermap.org/data/2.5/uvi?appid=" + APIKey + "&lat=" + lat + "&lon=" + lon,
                    method: "GET"
                }).then(function(response) {
                    console.log(response);

                    //adding UV index Text
                    var colorIndex = $("<p>")
                    colorIndex.addClass("data")
                    colorIndex.attr("id", "uv-index")


                    $(colorIndex).text(response.value)
                    $("#current-city").append(colorIndex)
                    console.log(response.value)

                    var uvValue = response.value
                        // CSS attributes to index value
                    if (uvValue < "3") {
                        colorIndex.attr("style", "background-color:green")
                    }
                    if (uvValue >= "3" && uvValue <= "5.99") {
                        colorIndex.attr("style", "background-color: gold")
                    }
                    if (uvValue >= "6" && uvValue <= "7.99") {
                        colorIndex.attr("style", "background-color: orange")
                    }
                    if (uvValue >= "8" && uvValue <= "10.99") {
                        colorIndex.attr("style", "background-color: red")
                    }
                    if (uvValue === "11" || uvValue > "11") {
                        colorIndex.attr("style", "background-color:Indigo")
                    }
                })
                /*The 5 day forecast*/
            var forecastURL = "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + lon + "&appid=" + APIKey
            $.ajax({
                url: forecastURL,
                method: "GET"
            }).then(function(response) {
                console.log(response);

                for (var i = 0; i < 5; i++) {
                    //Forecast elements
                    var cardforecast = $("<section>")
                    var Headerforecast = $("<h3>")
                    var icon = $("<img>")
                    var tempforecast = $("<p>")
                    var humidforecast = $("<p>")


                    //adding class to our forecast elements
                    cardforecast.addClass("card")
                    Headerforecast.addClass("forecast-date")
                    icon.addClass("forecast-icon")
                    tempforecast.addClass("forcast-temp")
                    humidforecast.addClass("forecast-humidity")

                    // adding attributes to our forecast elements
                    icon.attr("src", " https://openweathermap.org/img/wn/" + iconID + ".png")

                    //changing data to readable form.
                    UnixTimestamp = (response.daily[i].dt)
                    milliseconds = UnixTimestamp * 1000
                    dateObject = new Date(milliseconds)
                    humanDateFormat = dateObject.toLocaleDateString("en-US", { month: "numeric", day: "numeric", year: "numeric" })
                    Farenheit = (response.daily[i].temp.day - 273.15) * 1.80 + 32;
                    console.log(Farenheit)
                        //adding text to our forecast elements
                    Headerforecast.text(humanDateFormat)
                    tempforecast.text("Temp: " + Farenheit.toPrecision(4) + " °F")
                    humidforecast.text("Humidity: " + response.daily[i].humidity + "%")



                    //apending our forecast elements
                    $(".five-day-forecast").append(cardforecast)
                    $(cardforecast).append(Headerforecast)
                    $(cardforecast).append(icon)
                    $(cardforecast).append(tempforecast)
                    $(cardforecast).append(humidforecast)
                }
            });


        })
}

function renderSearchButton() {

    $(".searchBtn").on("click", function() {
        event.preventDefault();

        city = $("#search-bar").val().trim();
        displayWeatherData(city);


        var results = $("<p>");
        results.addClass("results");
        results.attr("data-name");
        results.text(city)
        $(".form").append(results);





        console.log(city)

        cities.push(City)

        if (localStorage.getItem("allCities")) {
            var citiesString = [...cities, ...JSON.parse(localStorage.getItem("allCities"))]
            var noDuplicates = citiesString.filter((item, index) => citiesString.indexOf(item) === index);
            noDuplicates = JSON.stringify(noDuplicates);
            localStorage.setItem("allCities", noDuplicates)
        } else {
            var citiesString = JSON.stringify(cities)
            localStorage.setItem("allCities", citiesString)
        }


        console.log(cities)

    })

}

function renderCitiesLocalStorage() {
    var citiesArray = JSON.parse(localStorage.getItem("allCities"))

    for (var i = 0; i < citiesArray.length; i++) {

        var results = $("<p>");
        results.addClass("results");
        results.attr("data-name", citiesArray[i]);
        results.text(citiesArray[i]);
        $(".form").append(results);
        results.on("click", function() {
            event.preventDefault();
            displayWeatherData($(this).attr("data-name")); // using this inside an onclick $(this) = button being clicked 
        })
    }


}


if (localStorage.getItem("allCities")) {
    renderCitiesLocalStorage();

}







renderSearchButton();