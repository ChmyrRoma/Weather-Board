import { TTemperatureModeTypes } from '../store/reducers/cities.ts';

interface IStorageCity {
  name: string,
  temperatureMode: TTemperatureModeTypes,
}

export const localStorageHelper = {
  getCities: function(): IStorageCity[] {
    const citiesJSON = localStorage.getItem('cities');
    return citiesJSON ? JSON.parse(citiesJSON) : [];
  },
  setCities: function(cities: IStorageCity[]) {
    localStorage.setItem('cities', JSON.stringify(cities));
  },
  getLanguage: function() {
    return localStorage.getItem('language') || '';
  },
  setLanguage: function(language: string) {
    localStorage.setItem('language', language);
  },
  getTemperature: function() {
    return localStorage.getItem('temperature') || '';
  },
  setTemperature: function(temperature: string) {
    localStorage.setItem('temperature', temperature);
  },
  setCityByName: function(name: string) {
    const cities = this.getCities();
    if (!cities.find(city => city.name === name)) {
      cities.push({ name, temperatureMode: 'celsius' });
      this.setCities(cities);
    }
  },
  getCityTemperatureModeByName: function(name: string) {
    const cities = this.getCities();
    const currentCity = cities.find(city => city.name === name);

    return currentCity?.temperatureMode || null
  },
  setCityTemperatureModeByName: function(name: string, temperatureMode: TTemperatureModeTypes) {
    const cities = this.getCities();

    cities.map(city => {
      if (city.name === name) {
        city.temperatureMode = temperatureMode;
      }
      return city;
    })

    this.setCities(cities);
  },
  setIsCityFromMyLocation: function (name: string) {
    localStorage.setItem('isCityFromMyLocation', name)
  },
  removeIsCityFromMyLocation: function () {
    localStorage.removeItem('isCityFromMyLocation')
  },
  getIsCityFromMyLocation: function () {
    return localStorage.getItem('isCityFromMyLocation')
  },
  removeCityByName: function(name: string) {
    let cities = this.getCities();
    cities = cities.filter(city => city.name !== name);
    this.setCities(cities);
  },
};
