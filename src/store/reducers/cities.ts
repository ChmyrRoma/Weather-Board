import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import { IWeatherForecast } from '../../types/cities/cities';

interface ICitiesWithWeather {
  name: string,
  weather: IWeatherForecast | null,
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
    setCityName: (state, action: PayloadAction<string>) => {
      const newCity: ICitiesWithWeather = {
        name: action.payload,
        weather: null
      };
      
      state.citiesWithWeather = [...state.citiesWithWeather, newCity]
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
