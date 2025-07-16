const request = require("request");

const openWeatherMap = {
    GEOCODE_URL: "http://api.openweathermap.org/geo/1.0/direct",
    SECRET_KEY: "7f81f661610058e9dd56e8b02c5fb33e"
};

const geocode = (city, callback) => {
    if (!city) {
        return callback("City name is required.", null);
    }

    const url = `${openWeatherMap.GEOCODE_URL}?q=${encodeURIComponent(city)}&limit=1&appid=${openWeatherMap.SECRET_KEY}`;

    request({ url, json: true }, (error, response) => {
        if (error) {
            callback("Unable to connect to geocoding service.", null);
        } else if (!response.body || response.body.length === 0) {
            callback("Location not found. Try another city.", null);
        } else {
            const data = response.body[0];
            callback(null, {
                lat: data.lat,
                lon: data.lon,
                name: `${data.name}, ${data.country}`
            });
        }
    });
};

module.exports = geocode;
