import React, { useEffect, useState } from 'react';
import { CircularProgress } from '@mui/material';

import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import { getLocationCitySlice, setCitiesNameSlice, setCityNameSlice } from '../../../store/slices/cities.ts';
import { localStorageHelper } from '../../../helpers/localStorageHelper';

import CityCard from '../CityCard/CityCard';

import styles from './CititesContainer.module.scss';

const CitiesContainer: React.FC = () => {
  const { citiesWithWeather } = useAppSelector(state => state.cities);
  const dispatch = useAppDispatch();
  const [userLocation, setUserLocation] = useState<{ latitude: number, longitude: number } | null>(null);
  const [isLoading, setIsLoading] = useState(false);

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

        const coordinates = { latitude, longitude };
        const cities = localStorageHelper.getCities();

        const response = await dispatch(getLocationCitySlice(coordinates));
        const name = `${response.payload.address.city}, ${response.payload.address.country_code.toUpperCase()}`;
        const previousCity = cities.find(city => city === name);
        if (response.payload) {
          if (!previousCity) {
            dispatch(setCityNameSlice({ name, isCityFromMyLocation: true }));
          }
          }
            setIsLoading(false)
        })(userLocation.latitude, userLocation.longitude)
    }
  }, [userLocation])


  useEffect(() => {
    const cities = localStorageHelper.getCities();
    if (cities) {
      const test = localStorageHelper.getIsCityFromMyLocation();
      const index = cities.indexOf(test)
      if (index !== -1) {
        const removedItem = cities.splice(index, 1)[0];
        cities.unshift(removedItem);
      }

      dispatch(setCitiesNameSlice(cities));
    }
  }, [])

  return (
    <div className={styles.citiesContainer}>
      {isLoading ? (
        <div className={styles.citiesContainer__spinner}>
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
