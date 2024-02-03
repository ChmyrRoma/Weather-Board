import React, { useEffect, useState } from 'react';

import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import {getLocationCitySlice, setCitiesNameSlice, setCityNameSlice} from '../../../store/slices/cities.ts';
import { localStorageHelper } from '../../../helpers/localStorageHelper';

import CityCard from '../CityCard/CityCard';
import {CircularProgress} from "@mui/material";

const CitiesContainer: React.FC = () => {
  const { citiesWithWeather } = useAppSelector(state => state.cities)
  const dispatch = useAppDispatch();
  console.log('@@@@@@', citiesWithWeather)
  const [userLocation, setUserLocation] = useState<{ latitude: number, longitude: number } | null>(null);
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const getUserLocation = () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const latitude = position.coords.latitude;
            const longitude = position.coords.longitude;

            setUserLocation({ latitude, longitude });
          },
          (error) => {
            console.error('Error getting user location:', error);
          }
        );
      } else {
        console.error('Geolocation is not supported by this browser.');
      }
    };

    getUserLocation();
  }, []);

  useEffect(() => {
    if (userLocation) {
      (async (latitude: number, longitude: number ) => {
          setIsLoading(true);

          const coordinates = { latitude, longitude }

          const response = await dispatch(getLocationCitySlice(coordinates));
          if (response.payload) {
            dispatch(setCityNameSlice(response.payload.name));
            setIsLoading(false)
          }
        })(userLocation.latitude, userLocation.longitude)
    }
  }, [userLocation])


  useEffect(() => {
    const cities = localStorageHelper.getCities()
    if (cities) {
      dispatch(setCitiesNameSlice(cities))
    }
  }, [])

  return (
    <div style={{ display: 'flex' }}>
      {isLoading ? (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%', height: '500px' }}>
          <CircularProgress size={100} />
        </div>
      ) : (
        [citiesWithWeather.length ? citiesWithWeather.map((el, index) => (
          <div key={index}>
            <CityCard name={el.name} />
          </div>
        )) : 'No cities']
      )}
    </div>
  )
}

export default CitiesContainer;
