import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IWeatherForecast } from '../../types/cities/cities';
import { localStorageHelper } from '../../helpers/localStorageHelper';

export interface ICitiesWithWeather {
  name: string,
  weather: IWeatherForecast | null,
  isCityFromMyLocation?: boolean,
}

export interface ICitiesSlice {
  citiesWithWeather: ICitiesWithWeather[]
}

const initialState = {
  citiesWithWeather: [],
} as ICitiesSlice

export const citiesSlice = createSlice({
  name: 'cities',
  initialState,
  reducers: {
    setCityName: (state, action: PayloadAction<{name: string, isCityFromMyLocation?: boolean}>) => {
      const newCity: ICitiesWithWeather = {
        name: action.payload.name,
        weather: null
      };

      if (action.payload.isCityFromMyLocation) {
        newCity.isCityFromMyLocation = action.payload.isCityFromMyLocation
        localStorageHelper.setIsCityFromMyLocation(action.payload.name)
      }

      state.citiesWithWeather = action.payload.isCityFromMyLocation ? [newCity, ...state.citiesWithWeather] :[...state.citiesWithWeather, newCity]
    },
    // payload: string[] - string = cityName
    setCitiesName: (state, action: PayloadAction<string[]>) => {
      const newCities = action.payload.map((cityName) => {
        const newCity: ICitiesWithWeather = {
          name: cityName,
          weather: null
        };

        return newCity;
      })

      state.citiesWithWeather = [...state.citiesWithWeather, ...newCities]
    },
    setCityWeatherByName: (state, action: PayloadAction<{ name: string, weather: IWeatherForecast }> ) => {
      state.citiesWithWeather = state.citiesWithWeather.map(city => ({
        ...city,
        weather: city.name === action.payload.name ? action.payload.weather : city.weather,
      }));
    },
    removeCityByName: (state, action: PayloadAction<string>) => {
      state.citiesWithWeather = state.citiesWithWeather.filter(city => city.name !== action.payload)
    },
    resetCities: (state) => {
      state.citiesWithWeather = []
    }
  }
});

export const {
  setCityName,
  setCityWeatherByName,
  removeCityByName,
  resetCities,
  setCitiesName
} = citiesSlice.actions;
