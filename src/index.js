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
    displayWeather(processed);
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
    toggleLoading();
  } else {
    input.reportValidity();
  }
}

function displayWeather(obj) {
  clear();
  const content = document.getElementById('content');
  const name = document.getElementById('name');
  name.textContent = obj.name;
  const weather = obj.weather.main;
  const pWeather = document.createElement('p');
  pWeather.textContent = `Weather: ${weather}`;
  const { temp } = obj.main;
  const pTemp = document.createElement('p');
  pTemp.textContent = `Temp: ${temp} F`;
  content.appendChild(pWeather);
  content.appendChild(pTemp);
  setPic(obj);
  toggleLoading();
}

async function setPic(obj) {
  const q = obj.weather.main;
  const imgUrl = await getPic(q);
  const img = document.createElement('img');
  img.src = imgUrl;
  const content = document.getElementById('content');
  content.appendChild(img);
}

async function getPic(q) {
  const url = `https://pixabay.com/api/?key=27682534-5d9a93393ee400253db992ca2&q=${q}+weather`;
  const response = await fetch(url, { mode: 'cors' });
  const json = await response.json();
  const imageUrl = json.hits[0].largeImageURL;
  return imageUrl;
}

function clear() {
  const content = document.getElementById('content');
  content.innerHTML = '';
}

function toggleLoading() {
  const loading = document.getElementById('loading');
  loading.classList.toggle('hide');
}
