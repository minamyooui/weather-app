import './style.css';

const submit = document.getElementById('submit');
submit.onclick = getWeather;

async function getCoord(city) {
  const url = `http://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=b27874cd75ffa9fa8d6ea85206981fe4`;
  const response = await fetch(url, { mode: 'cors' });
  const data = await response.json();
  return data;
}

async function getData(city) {
  const coord = await getCoord(city);
  const { lat } = coord[0];
  const { lon } = coord[0];
  const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=imperial&appid=b27874cd75ffa9fa8d6ea85206981fe4`;
  const response = await fetch(url, { mode: 'cors' });
  const data = await response.json();
  return data;
}

function filterWeather(obj) {
  const processed = (({ main, name, weather }) => ({ main, name, weather: weather[0] }))(obj);
  return processed;
}

async function processWeather(city) {
  try {
    const data = await getData(city);
    const processed = filterWeather(data);
    console.log(processed);
  } catch (err) {
    console.error(err);
    console.log('Unable to find city');
  }
}

function getWeather() {
  const input = document.getElementById('city');
  const city = input.value;
  if (input.checkValidity()) {
    processWeather(city);
  } else {
    input.reportValidity();
  }
}
