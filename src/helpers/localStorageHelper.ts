export const localStorageHelper = {
  getCities: function(): string[] {
    const citiesJSON = localStorage.getItem('cities');
    return citiesJSON ? JSON.parse(citiesJSON) : [];
  },
  setCities: function(cities: string[]) {
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
    if (!cities.includes(name)) {
      cities.push(name);
      this.setCities(cities);
    }
  },
  removeCityByName: function(name: string) {
    let cities = this.getCities();
    cities = cities.filter(city => city !== name);
    this.setCities(cities);
  },
  clearCities: function() {
    localStorage.removeItem('cities');
  },
  clearLanguage: function() {
    localStorage.removeItem('language');
  },
  clearTemperature: function() {
    localStorage.removeItem('temperature');
  },
  clearAll: function() {
    localStorage.clear();
  }
};
