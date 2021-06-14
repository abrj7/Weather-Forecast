const express = require("express");
const https = require("https");
const bodyParser = require("body-parser");;
const app = express();

app.use(bodyParser.urlencoded({extended: true}));

app.get("/", function(req, res){
    res.sendFile(__dirname + "/index.html")
})

app.get('/style.css', function(req, res) {
  res.sendFile(__dirname + "/" + "style.css");
});

app.post("/", function(req, res){
    const query = req.body.cityName

    const apiKey = "c7acc05bc562060735659b81b9e78268"
    const unit = req.body.units
    var unitSymbol = "";

    if (unit == "metric"){
        unitSymbol = "°C"
    } else if (unit == "imperial"){
        unitSymbol = "°F"
    } else if (unit == "standard"){
        unitSymbol = "K"
    }


    const url = "https://api.openweathermap.org/data/2.5/weather?q=" + query +"&appid=" + apiKey + "&units=" + unit;
    https.get(url, function(response){
        console.log(response.statusCode);

        response.on("data", function(data){
        const weatherData = JSON.parse(data)

        const city = query.slice(0, 1).toUpperCase() + query.slice(1, query.length);
        const temp = weatherData.main.temp;
        const weatherDescription = weatherData.weather[0].description;
        const icon = weatherData.weather[0].icon;
        const feelsLike = weatherData.main.feels_like;
        const maxTemp = weatherData.main.temp_max;
        const minTemp = weatherData.main.temp_min;
        const humidity = weatherData.main.humidity;
        const visibility = weatherData.visibility;
        const windSpeed = weatherData.wind.speed;
        const country = weatherData.sys.country;

        const imageURL = "http://openweathermap.org/img/wn/" + icon + "@2x.png"

        res.write(`
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width">
            <title>Weather Forecast.</title>
            <style>
                @import url('https://fonts.googleapis.com/css2?family=Hammersmith+One&display=swap');
                body{
                    font-family: 'Hammersmith One', sans-serif;
                    color: gray;
                    background-color: #dbe0e2;

                }
                h1{
                    padding-left: 120px;
                    padding-top: 100px;
                }

                h3{
                    padding-left: 120px;
                }
                h2{
                    color: black;
                }

                img{
                    padding-left: 100px;
                    width: 100px;
                    height: 100px;
                }
                td{
                    padding-left: 20px;
                }

            </style>
        </head>
        <body>
            <h1>`+ city +`, ` + country + `</h1>
            <table>
                <tr>
                    <td><img src="` + imageURL + `"></td>
                    <td><h2>` + temp + unitSymbol +`</h2>
                    <p>Low: ` + minTemp + unitSymbol +`</p>
                    <p>High: ` + maxTemp + unitSymbol +`</p>
                    <td><h2>` + weatherDescription + `</h2>
                        <p>Feels like: ` + feelsLike + unitSymbol +`</p>
                        <p>Wind Speed: ` + windSpeed + `</p></td>
                    </td>
                    <td><h2></h2>
                        <p>Humidity: ` + humidity + `</p>
                        <p>Visibility: ` + visibility + `</p></td>
                    </td>
                </tr>
            </table>
        </body>
        </html>
        `)




        })
    })
})




app.listen(3000, function(){
  console.log("Server is running.")
})