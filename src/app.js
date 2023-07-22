let celsiusTemperature = null;

function formatDate(timestamp) {
  let date = new Date(timestamp * 1000);
  let hours = date.getHours().toString().padStart(2, "0");
  let minutes = date.getMinutes().toString().padStart(2, "0");

  let days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  let day = days[date.getDay()];

  return `${day} ${hours}:${minutes}`;
}

function displayWeatherForecast(forecastData) {
  let forecastElement = document.querySelector(".weather-forecast");
  forecastElement.innerHTML = "";

  if (!forecastData || !forecastData.daily || forecastData.daily.length === 0) {
    forecastElement.innerHTML = "<p>No weather forecast available</p>";
    return;
  }

  let forecastHTML = '<div class="row">';

  let days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  forecastData.daily.slice(0, 6).forEach((forecast, index) => {
    let iconURL = forecast.condition.icon_url;
    let description = forecast.condition.description;
    let maxTemp = Math.round(forecast.temperature.maximum);
    let minTemp = Math.round(forecast.temperature.minimum);
    let timestamp = forecast.time;
    let dayAbbreviation = days[new Date(timestamp * 1000).getDay()];

    forecastHTML += `
      <div class="col-2">
        <div class="weather-forecast-date">${dayAbbreviation}</div>
        <img src="${iconURL}" alt="${description}" width="42" />
        <div class="weather-forecast-temperatures">
          <span class="weather-forecast-temp-max">${maxTemp}°</span> /
          <span class="weather-forecast-temp-min">${minTemp}°</span>
        </div>
      </div>
    `;
  });

  forecastHTML += "</div>";
  forecastElement.innerHTML = forecastHTML;
}

function getCurrentForecast(coordinates) {
  let apiKey = "fbbe9ta8fdc0e0287f054738101bbfo4";
  let apiUrl = `https://api.shecodes.io/weather/v1/forecast?lat=${coordinates.lat}&lon=${coordinates.lon}&key=${apiKey}&units=metric`;

  axios.get(apiUrl).then((response) => {
    displayWeatherForecast(response.data);
  });
}

function showTemperature(response) {
  let temperatureElement = document.querySelector("#temperature");
  let cityElement = document.querySelector("#city-name");
  let countryElement = document.querySelector("#country");
  let descriptionElement = document.querySelector("#description");
  let humidityElement = document.querySelector("#humidity");
  let windElement = document.querySelector("#wind");
  let dateElement = document.querySelector("#date");
  let iconElement = document.querySelector("#weather-icon");

  celsiusTemperature = response.data.temperature.current;
  let description = response.data.condition.description;
  temperatureElement.innerHTML = Math.round(celsiusTemperature);
  cityElement.innerHTML = response.data.city;
  countryElement.innerHTML = response.data.country;
  descriptionElement.innerHTML = description;
  humidityElement.innerHTML = response.data.temperature.humidity;
  windElement.innerHTML = response.data.wind.speed;
  dateElement.innerHTML = formatDate(response.data.time);

  let iconURL = response.data.condition.icon_url;
  iconElement.src = iconURL;
  iconElement.alt = description;

  getCurrentForecast(response.data.coordinates);
}

function search(city) {
  let apiKey = "fbbe9ta8fdc0e0287f054738101bbfo4";
  let units = "metric";
  let apiUrl = `https://api.shecodes.io/weather/v1/current?query=${city}&key=${apiKey}&units=${units}`;

  axios
    .get(apiUrl)
    .then((response) => {
      showTemperature(response);
      let coordinates = {
        lat: response.data.coordinates.latitude,
        lon: response.data.coordinates.longitude,
      };
      getCurrentForecast(coordinates);
    })
    .catch((error) => {
      console.error("Weather data not found!", error);
    });
}

function handleSubmit(event) {
  event.preventDefault();
  let cityInputElement = document.querySelector("#city-input");
  search(cityInputElement.value);
}

function showFahrenheitTemperature(event) {
  event.preventDefault();
  let temperatureElement = document.querySelector("#temperature");
  let fahrenheitTemp = (celsiusTemperature * 9) / 5 + 32;
  temperatureElement.innerHTML = Math.round(fahrenheitTemp);
}

function showCelsiusTemperature(event) {
  event.preventDefault();
  let temperatureElement = document.querySelector("#temperature");
  temperatureElement.innerHTML = Math.round(celsiusTemperature);
}

let form = document.querySelector("#search-city");
form.addEventListener("submit", handleSubmit);

let fahrenheitLink = document.querySelector("#fahrenheit-link");
fahrenheitLink.addEventListener("click", showFahrenheitTemperature);

let celsiusLink = document.querySelector("#celsius-link");
celsiusLink.addEventListener("click", showCelsiusTemperature);

search("Johannesburg");
