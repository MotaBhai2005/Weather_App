const express = require("express");
const hbs = require("hbs");
const path = require("path");

const app = express();
const weatherData = require("../utils/weatherData");
const geocode = require("../utils/geocode");

const publicPath = path.join(__dirname, "../public");
const viewsPath = path.join(__dirname, "../templates/views");
const partialsPath = path.join(__dirname, "../templates/partials");

app.set("view engine", "hbs");
app.set("views", viewsPath);
hbs.registerPartials(partialsPath);
app.use(express.static(publicPath));

const port = process.env.PORT || 3000;

app.get("/", (req, res) => {
    res.render("index", {title: "Weather App"});
});

app.get("/weather", (req, res) => {
    const { address } = req.query;

    if (!address) {
        return res.send({ error: "Address is required." });
    }

    geocode(address, (geoErr, { lat, lon, name } = {}) => {
        if (geoErr) return res.send({ error: geoErr });

        weatherData({ lat, lon }, (weatherErr, weather) => {
            if (weatherErr) return res.send({ error: weatherErr });

            res.send({
                location: name,
                forecast: weather
            });
        });
    });
});

app.get("/weather/geo", (req, res) => {
    const { lat, lon } = req.query;

    if (!lat || !lon) {
        return res.send({ error: "Latitude and longitude are required." });
    }

    weatherData({ lat, lon }, (weatherErr, weather) => {
        if (weatherErr) return res.send({ error: weatherErr });

        res.send({
            location: `Your Location`,
            forecast: weather
        });
    });
});

app.listen(port, () => {
    console.log("Server is listening on port " + port);
});
