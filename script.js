const apiKey = 'a51f045db608537199f44a87b5a45106';
const cityInput = document.querySelector('.city-input');
const searchBtn = document.querySelector('.search-btn');
const locationBtn = document.querySelector('.location-btn');
const weatherData = document.querySelector('.weather-data');
const weatherCondition = document.querySelector('#weather-condition');

searchBtn.addEventListener('click', async () => {
  const city = cityInput.value.trim();
  if (city) {
    try {
      const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`);
      const data = await response.json();
      if (data.cod === 200) {
        updateWeatherData(data);
      } else {
        console.error(data.message);
        weatherData.innerHTML = `<p>Error: ${data.message}</p>`;
      }
    } catch (error) {
      console.error(error);
      weatherData.innerHTML = `<p>Error fetching data</p>`;
    }
  }
});

locationBtn.addEventListener('click', async () => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(async (position) => {
      const lat = position.coords.latitude;
      const lon = position.coords.longitude;
      try {
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`);
        const data = await response.json();
        if (data.cod === 200) {
          updateWeatherData(data);
        } else {
          console.error(data.message);
          weatherData.innerHTML = `<p>Error: ${data.message}</p>`;
        }
      } catch (error) {
        console.error(error);
        weatherData.innerHTML = `<p>Error fetching data</p>`;
      }
    });
  } else {
    console.error('Geolocation is not supported by this browser.');
    weatherData.innerHTML = `<p>Geolocation is not supported by this browser.</p>`;
  }
});

function updateWeatherData(data) {
  const city = data.name;
  const temperature = Math.round(data.main.temp); // Temperature in Celsius
  const wind = data.wind.speed;
  const humidity = data.main.humidity;
  const condition = data.weather[0].main;

  weatherData.innerHTML = `
    <h2 id="city-name">${city} (${data.sys.country})</h2>
    <h6 id="temperature">Temperature: ${temperature}°C</h6>
    <h6 id="wind">Wind: ${wind} M/S</h6>
    <h6 id="humidity">Humidity: ${humidity}%</h6>
    <h6 id="condition">Condition: <span id="weather-condition">${getWeatherCondition(condition)}</span></h6>
  `;
}

function getWeatherCondition(condition) {
  switch (condition) {
    case 'Rain':
      return 'Raining';
    case 'Clouds':
      return 'Cloudy';
    case 'Clear':
      return 'Sunny';
    case 'Snow':
      return 'Snowing';
    case 'Thunderstorm':
      return 'Thunderstorm';
    default:
      return 'Unknown';
  }
}
