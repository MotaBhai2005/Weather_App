const request = require("request");

const openWeatherMap = {
    BASE_URL: "https://api.openweathermap.org/data/2.5/weather",
    SECRET_KEY: "7f81f661610058e9dd56e8b02c5fb33e"
};

const weatherData = ({ lat, lon }, callback) => {
    const url = `${openWeatherMap.BASE_URL}?lat=${lat}&lon=${lon}&appid=${openWeatherMap.SECRET_KEY}&units=metric`;

    request({ url, json: true }, (error, response) => {
        if (error) {
            callback(true, "Unable to fetch weather data.");
        } else if (response.body.cod !== 200) {
            callback(true, "Weather API Error: " + response.body.message);
        } else {
            const data = response.body;
            callback(false, {
                city: data.name,
                temp: data.main.temp,
                description: data.weather[0].description,
                humidity: data.main.humidity,
                feels_like: data.main.feels_like
            });
        }
    });
};

module.exports = weatherData;
