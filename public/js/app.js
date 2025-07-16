// Get DOM elements
const form = document.querySelector("#weather-form");
const input = document.querySelector("#address");
const resultDiv = document.querySelector("#result");
const loadingText = document.querySelector("#loading");

// Create and insert custom location image icon
const locationImg = document.createElement("img");
locationImg.src = "/img/gps-icon.png"; // Make sure this image is in public/img
locationImg.alt = "Use My Location";
locationImg.title = "Use My Location";
locationImg.id = "location-icon";
locationImg.style.cursor = "pointer";

// Insert icon after input
input.insertAdjacentElement("afterend", locationImg);

// 🌆 Handle city form submission
form.addEventListener("submit", (e) => {
    e.preventDefault(); // Prevent page reload

    const city = input.value.trim();

    if (!city) {
        resultDiv.innerHTML = "❗ Please enter a city name.";
        return;
    }

    fetchWeatherByCity(city);
});

// 📍 Handle location icon click
locationImg.addEventListener("click", (e) => {
    e.preventDefault();

    if (!navigator.geolocation) {
        return alert("Geolocation is not supported by your browser.");
    }

    loadingText.style.display = "block";
    resultDiv.innerHTML = "";

    navigator.geolocation.getCurrentPosition(
        (position) => {
            const lat = position.coords.latitude;
            const lon = position.coords.longitude;

            fetch(`/weather/geo?lat=${lat}&lon=${lon}`)
                .then((res) => res.json())
                .then((data) => {
                    loadingText.style.display = "none";
                    if (data.error) {
                        resultDiv.innerHTML = `❌ ${data.error}`;
                    } else {
                        resultDiv.innerHTML = formatResult(data);
                    }
                });
        },
        (err) => {
            loadingText.style.display = "none";
            alert("Unable to retrieve your location.");
        }
    );
});

// 🌐 Function to fetch weather using city name
function fetchWeatherByCity(city) {
    loadingText.style.display = "block";
    resultDiv.innerHTML = "";

    fetch(`/weather?address=${encodeURIComponent(city)}`)
        .then((res) => res.json())
        .then((data) => {
            loadingText.style.display = "none";

            if (data.error) {
                resultDiv.innerHTML = `❌ ${data.error}`;
            } else {
                resultDiv.innerHTML = formatResult(data);
            }
        });
}

// 🧾 Format the weather result
function formatResult(data) {
    return `
        <h3>📍 ${data.location}</h3>
        <p>🌡 Temperature: ${data.forecast.temp}°C</p>
        <p>📝 Weather: ${data.forecast.description}</p>
        <p>💧 Humidity: ${data.forecast.humidity}%</p>
        <p>🥵 Feels like: ${data.forecast.feels_like}°C</p>
    `;
}
