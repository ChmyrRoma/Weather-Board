import { createAsyncThunk } from '@reduxjs/toolkit';
import { AsyncThunkConfig } from '@reduxjs/toolkit/dist/createAsyncThunk';
import { restAPI } from '../rest/rest';
import {
  setCityName,
  setCityWeatherByName,
  removeCityByName,
  setCitiesName,
} from '../reducers/cities';
import { localStorageHelper } from '../../helpers/localStorageHelper';
import { ICity } from '../../types/cities/cities.ts';


export const getCitiesSlice = createAsyncThunk<object, string, AsyncThunkConfig>(
  'getCitiesSlice',
  async(data: string) => {
    const response = await restAPI.getCities(data);
    if (response?.data) {
      const geonames = response?.data?.geonames as ICity[];
      return geonames.filter((city) => city.fclName === "city, village,..." )
    }
    return [];
  },
)

export const setCityNameSlice = createAsyncThunk(
  'setCityNameSlice',
  async (data: {name: string, isCityFromMyLocation?: boolean}, thunkAPI) => {
    localStorageHelper.setCityByName(data.name);
    return thunkAPI.dispatch(setCityName(data));
  },
)

export const setCitiesNameSlice = createAsyncThunk<string, string[], AsyncThunkConfig>(
  'setCitiesNameSlice',
  async (citiesName: string[], thunkAPI) => {
    return thunkAPI.dispatch(setCitiesName(citiesName))
  }
)

export const removeCityByNameSlice = createAsyncThunk(
  'removeCityByNameSlice',
  async (cityName: string, thunkAPI) => {
    localStorageHelper.removeCityByName(cityName)
    return thunkAPI.dispatch(removeCityByName(cityName))
  }
)


export const getWeatherByCityName = createAsyncThunk<object, string, AsyncThunkConfig>(
  'getWeatherByCityName',
  async(cityName: string, thunkAPI) => {
    const response = await restAPI.getWeather(cityName)

    if (response) {
      thunkAPI.dispatch(setCityWeatherByName({name: cityName, weather: response.data}))
    }
    return response
  }
)
export const getWeatherIconSlice = createAsyncThunk<string | null | undefined, string>(
  'getWeatherIconSlice',
  async (iconUrl: string) => {
    const response = await restAPI.getWeatherIconSlice(iconUrl);
    if (response) {
      return response.config.url;
    }

    return null;
  }
);

export const getLocationCitySlice = createAsyncThunk(
  'getLocationCitySlice',
  async (coordinates: { latitude: number, longitude: number }) => {
    const response = await restAPI.getLocationCitySlice(coordinates.latitude, coordinates.longitude)
    if (response) {
      return response.data;
    }

    return null
  }
)
