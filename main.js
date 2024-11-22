const timeEl = document.getElementById('time');
const dateEl = document.getElementById('date');
const currentWeatherItemsEl = document.getElementById('current-Weather-Item');
const timeZoneEl = document.getElementById('time-Zone');
const countryEl = document.getElementById('country');
const countryTempEl = document.getElementById('country-temp');


const days =['Sunday', 'Monday' ,'Tuesday','Wednesday', 'Thursday' , 'Friday' ,  'Saturday ' ];
const months =[ 'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December' ];


const ApI_KEY =' 08b53f705ed6294d18af94afc94a1278  ';

setInterval(()=>{
    const time = new Date();
    const month = time.getMonth();
    const date =  time.getDate(); 
    const currentDay =  time.getDay();
    const hour =  time.getHours();
    const hoursIn12HrFormat =  hour === 0 ? 12 : hour > 12 ? hour % 12 : hour;
    const minutes = time.getMinutes();
    const ampm =  hour >= 12 ? 'PM' : 'AM';


    timeEl.innerHTML = 
    (hoursIn12HrFormat < 10 ? '0' + hoursIn12HrFormat : hoursIn12HrFormat) +
    ':' +
    (minutes < 10 ? '0' + minutes : minutes) +
    ` <span id="am-pm">${ampm}</span>`;

     
    dateEl.innerHTML =`${days[currentDay]}, ${months[month]} ${date}`;


}, 1000);



// جلب بيانات الطقس
function getWeatherData() {
    if (navigator.geolocation) {
        loaderEl.style.display = 'block';
        navigator.geolocation.getCurrentPosition((position) => {
            const { latitude, longitude } = position.coords;

            fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&exclude=hourly,minutely&appid=${API_KEY}&units=metric`)
                .then((response) => response.json())
                .then((data) => {
                    loaderEl.style.display = 'none';
                    showWeatherData(data);
                })
                .catch((error) => {
                    loaderEl.style.display = 'none';
                    console.error('Error fetching weather data: ', error);
                });
        }, (error) => {
            loaderEl.style.display = 'none';
            alert('Unable to retrieve your location.');
            console.error('Error getting location: ', error);
        });
    } else {
        alert('Geolocation is not supported by your browser.');
    }
}

function showWeatherData(data) {
    const { humidity, pressure, sunrise, sunset, wind_speed } = data.current;
    const timezone = data.timezone;
    const daily = data.daily;

    timeZoneEl.textContent = timezone;
    countryEl.textContent = `${data.lat.toFixed(2)}°N ${data.lon.toFixed(2)}°E`;

    currentWeatherItemsEl.innerHTML = `
        <div class="weather-item"><span>Humidity:</span> ${humidity}%</div>
        <div class="weather-item"><span>Pressure:</span> ${pressure} hPa</div>
        <div class="weather-item"><span>Wind Speed:</span> ${wind_speed} m/s</div>
        <div class="weather-item"><span>Sunrise:</span> ${moment(sunrise * 1000).format('hh:mm A')}</div>
        <div class="weather-item"><span>Sunset:</span> ${moment(sunset * 1000).format('hh:mm A')}</div>
    `;

    let forecastHTML = '';
    daily.forEach((day, idx) => {
        if (idx === 0) {
            forecastHTML += `
                <div class="weather-forecast-item today">
                    <div class="day">Today</div>
                    <img src="https://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png" alt="Weather icon" class="w-icon">
                    <div class="temp">Night: ${day.temp.night.toFixed(1)}°C</div>
                    <div class="temp">Day: ${day.temp.day.toFixed(1)}°C</div>
                </div>`;
        } else {
            forecastHTML += `
                <div class="weather-forecast-item">
                    <div class="day">${days[new Date(day.dt * 1000).getDay()]}</div>
                    <img src="https://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png" alt="Weather icon" class="w-icon">
                    <div class="temp">Night: ${day.temp.night.toFixed(1)}°C</div>
                    <div class="temp">Day: ${day.temp.day.toFixed(1)}°C</div>
                </div>`;
        }
    });

    forecastEl.innerHTML = forecastHTML;
}

// بدء التطبيق
getWeatherData();
































