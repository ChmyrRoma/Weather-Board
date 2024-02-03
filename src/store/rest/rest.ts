import axios from 'axios';

const API_KEY = '76424010431a2a6e434200c510322927'


const getWeather = (value: string) => {
  const requestAxios = axios.get(`https://api.openweathermap.org/data/2.5/forecast?q=${value}&appid=${API_KEY}`)
    .then((data) => data)
    .catch((error) => console.log(error))

  return requestAxios
}

const getCities = (value: string) => {
  if (value.length) {
    const requestAxios = axios.get(`http://api.geonames.org/searchJSON?username=demoRoma&q=${value}&maxRows=3`)
    .catch((error) => console.log(error))

    return requestAxios
  }
}

const getWeatherIconSlice = (iconUrl: string) => {
  if (iconUrl) {
    const requestAxios = axios.get(`https://openweathermap.org/img/wn/${iconUrl}@2x.png`)
      .catch((error) => {
        console.log(error);
        throw error;
      });
    return requestAxios
  }
}

const getLocationCitySlice = (lat: number, lon: number) => {
    const requestAxios = axios.get(`https://nominatim.openstreetmap.org/reverse`, {
      params: {
        format: 'json',
        zoom: 10,
        addressdetails: 1,
        'accept-language': 'en',
        lat,
        lon,
      },
    }).then((data) => data)
      .catch((error) => console.log(error))

    return requestAxios
}

export const restAPI = {
  getWeather,
  getCities,
  getWeatherIconSlice,
  getLocationCitySlice
}
