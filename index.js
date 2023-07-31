import express from "express";
import axios from "axios";
import bodyParser from "body-parser";
import "dotenv/config";

const app = express();
const port = 3000;

app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");


app.get("/", (req, res) => {
    res.render("index");
})

const apiKey = process.env.KEY;

app.post("/", async (req, res) => {
    let query = req.body["city"];
    const url1 = "https://api.openweathermap.org/data/2.5/weather?&q=" + query + "&" + "appid=" + apiKey + "&units=metric";
    const nameCapitalized = query.charAt(0).toUpperCase() + query.slice(1).toLowerCase();

    try {
        const result1 = await axios.get(url1);
        const result2 = await axios.get(
            "https://api.openweathermap.org/data/3.0/onecall?lat=" + result1.data.coord.lat + "&" + "lon=" + result1.data.coord.lon + "&" + "exclude=minutely,hourly" + "&appid=" + apiKey + "&units=metric"
        );
        
        res.render("index", {
            header: nameCapitalized + " " + " <span> currently </span>",
            content: result2.data.current.temp + "°",
            descrip: result2.data.current.weather[0].description,
            imgUrl: "https://openweathermap.org/img/wn/" + result2.data.current.weather[0].icon + "@2x.png",
            today: "Today's Forecast for " + nameCapitalized,
            morning: "Morning",
            morningTemp: result2.data.daily[0].temp.morn +"°",
            afternoon: "Afternoon",
            afternoonTemp: result2.data.daily[0].temp.day + "°",
            evenning: "Evenning",
            evenningTemp: result2.data.daily[0].temp.eve + "°",
            overnight: "Overnight",
            overnightTemp: result2.data.daily[0].temp.night + "°",
            summary: result2.data.daily[0].summary,
            todayUrl: "https://openweathermap.org/img/wn/" + result2.data.daily[0].weather[0].icon + "@2x.png",
            weather: "Weather Today in " + nameCapitalized,
            feels: "Feels like",
            feelsTemp: result2.data.current.feels_like + "°",
            highLow: "High/Low",
            highLowTemp: result2.data.daily[0].temp.max + "°/" + result2.data.daily[0].temp.min + "°",
            wind: "Wind",
            windSpeed: result2.data.daily[0].wind_speed + "m/s",
            humidity: "Humidity",
            humid: result2.data.daily[0].humidity + "%",
            pressure: "Pressure",
            pressureValue: result2.data.daily[0].pressure + "hPa",
            dew: "Dew Point",
            dewPoint: result2.data.daily[0].dew_point + "°",
            uv: "UV Index",
            uvIndex: result2.data.daily[0].uvi,
            tommorrow: "Tommorrow's Forecast for " + nameCapitalized,
            tMorning: "Morning",
            tMtemp: result2.data.daily[1].temp.morn + "°",
            tAfternoon: "Afternoon",
            tAtemp: result2.data.daily[1].temp.day + "°",
            tEvenning: "Evenning",
            tEtemp: result2.data.daily[1].temp.eve + "°",
            tNight: "Night",
            tNtemp: result2.data.daily[1].temp.night + "°",
            tSummary: "There will be " + result2.data.daily[1].weather[0].description + " tommorrow",
            tommorrowUrl: "https://openweathermap.org/img/wn/" + result2.data.daily[1].weather[0].icon + "@2x.png"    
    });
    } catch (error) {
        console.error("Request failed with status code 404:", error.message);
        res.render("index.ejs", {error: "Put in correct City/Town name"}); 
    }
});

app.listen(process.env.PORT || port, (req, res) => {
    console.log(`Up and running on ${port}`);
})

