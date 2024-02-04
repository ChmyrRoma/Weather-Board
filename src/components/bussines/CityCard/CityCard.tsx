import React, { useState, useEffect, useMemo, useCallback } from 'react';
import * as classNames from 'classnames';
import { useTranslation } from 'react-i18next';
import moment from 'moment';
import CloseIcon from '@mui/icons-material/Close';

import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import {
  getWeatherByCityName,
  getWeatherIconSlice,
  removeCityByNameSlice,
} from '../../../store/slices/cities.ts';
import { WeatherForecast } from '../../../types/cities/cities.ts';
import WeatherChart from '../WeatherChart/WeatherChart';
import { localStorageHelper } from '../../../helpers/localStorageHelper';

import styles from './CityCard.module.scss';

interface IProps {
  name: string
}

export interface IGraphValue {
  labels: string[];
  temperatures: string[]
}

interface IGroupByTimestampItem {
  [key: string]: WeatherForecast[]
}


type TTemperatureModeTypes = 'celsius' | 'fahrenheit';

const ZERO_BY_FAHRENHEIT = 273;

const CityCard: React.FC<IProps> = ({ name }) => {
  const { t } = useTranslation()

  const { citiesWithWeather } = useAppSelector(state => state.cities)
  const dispatch = useAppDispatch();

  const [temperatureMode, setTemperatureMode] = useState<TTemperatureModeTypes>(localStorageHelper.getCityTemperatureModeByName(name) || 'celsius');
  const [timeAdded] = useState(moment())
  const [weatherIcon, setWeatherIcon] = useState(null)

  const currentCity = useMemo(() => citiesWithWeather.find(city => city.name === name), [citiesWithWeather])


  useEffect(() => {
    if (!name) return;
    dispatch(getWeatherByCityName(name))
  }, [name])


  useEffect(() => {
    (async () => {
      if (!closestDate) return;
      const response = await dispatch(getWeatherIconSlice(closestDate?.weather[0]?.icon))
      if (response.payload) setWeatherIcon(response.payload as string)
    })()
  }, [citiesWithWeather])


  const getCalculatedTemperature = useCallback((fahrenheitTemperature: number) => {
    if (temperatureMode === 'fahrenheit') return Math.round(fahrenheitTemperature).toString();

    // converte to celsius
    const temperatureInCelsius = Math.round(fahrenheitTemperature - ZERO_BY_FAHRENHEIT)

    return `${temperatureInCelsius > 0 ? `+${temperatureInCelsius}` : `${temperatureInCelsius}`}`
  }, [temperatureMode])

  const findClosestDate = (weatherForecasts: WeatherForecast[]) => {
    if (!weatherForecasts.length) return null;

    const currentDateTime = new Date();
    weatherForecasts
      .map(dateTime => new Date(dateTime.dt_txt))
      .sort((a, b) => Math.abs(currentDateTime - a) - Math.abs(currentDateTime - b));

    return weatherForecasts[0];
  };

  const closestDate = useMemo(() => findClosestDate(currentCity?.weather?.list || []), [currentCity?.weather?.list]);
  const acceptableTemp = useMemo(() => closestDate ? Number(getCalculatedTemperature(closestDate?.main?.temp)) > 0 : false, [currentCity?.weather?.list])

  const handleDelete = () => {
    dispatch(removeCityByNameSlice(name))
    if (currentCity.isCityFromMyLocation) {
      localStorageHelper.removeIsCityFromMyLocation()
    }
  }

  const convertedGraphValue: IGraphValue = useMemo(() => {
    const weatherList = currentCity?.weather?.list;
    const labels: string[] = []
    const temperatures: string[] = []

    const graphValues = { labels, temperatures }
    if (!weatherList) return graphValues;

    function groupByTimestamp(arr: WeatherForecast[]) {
      const formatTime = (timestamp: number) => moment.unix(timestamp).format('L');

      return arr.reduce((acc: IGroupByTimestampItem, obj) => {
        const key: string = formatTime(obj.dt);
        if (!acc[key]) {
          acc[key] = [];
          acc[key].push(obj);

        }
        return acc;
      }, {});
    }

    const weatherByDays: IGroupByTimestampItem = groupByTimestamp(weatherList);

    Object.keys(weatherByDays).forEach(day => {
      const currentWeatherDay: WeatherForecast[] = weatherByDays[day]
      if (currentWeatherDay) {
        labels.push(moment(currentWeatherDay[0].dt_txt).format('MM.DD'))
        const temperature = getCalculatedTemperature(currentWeatherDay[0]?.main?.temp)
        temperatures.push(temperature)
      }
    })

    return graphValues;
  }, [currentCity?.weather?.list, temperatureMode])


  const formattedTimeAdded = timeAdded.format('ddd, DD MMMM, HH:mm');

  const handleTemperatureMode = (tempMode: TTemperatureModeTypes) => {
    setTemperatureMode(tempMode)
    if (!currentCity?.name) return
    localStorageHelper.setCityTemperatureModeByName(currentCity.name, tempMode)
  }

  if (!currentCity || !currentCity?.weather || !closestDate) return null

  return (
    <div className={classNames(styles.card, {[styles.card_cold]: !acceptableTemp})}>
      <div className={styles.card__deleteButton} onClick={handleDelete}>
        <CloseIcon fontSize="smaller" />
      </div>
      <div className={styles.card__header}>
        <p className={styles.card__header_title}>{currentCity.name}</p>
        <div className={styles.card__header_description}>
          {weatherIcon && (
            <img src={weatherIcon} alt="weather-icon" className={styles.card__header_description_icon} />
          )}
          <p>{closestDate.weather[0].main}</p>
        </div>
      </div>
      <div className={styles.card__date}>{formattedTimeAdded}</div>
      <div className={styles.card__schedule}>
        <WeatherChart data={convertedGraphValue} acceptableTemp={acceptableTemp} temperatureMode={temperatureMode} />
      </div>
      <div className={styles.card__content}>
        <div className={styles.card__left}>
          <p className={styles.card__left_numb}>{getCalculatedTemperature(closestDate.main.temp)}</p>
          <div className={styles.card__left_gradus}>
            <p
              className={classNames(styles.card__left_gradues,
                {[styles.card__left_gradues_disabled]: temperatureMode === 'fahrenheit'}
              )}
              onClick={() => handleTemperatureMode("celsius")}
            >
              °C
            </p>
            <hr className={styles.card__left_line} />
            <p
              className={classNames(styles.card__left_gradues,
                {[styles.card__left_gradues_disabled]: temperatureMode === 'celsius'}
              )}
              onClick={() => handleTemperatureMode("fahrenheit")}
            >
              °F
            </p>
          </div>
        </div>
        <div className={styles.card__right}>
          <p>{t("card.wind")}: <b className={classNames(styles.card__right_wind, {[styles.card__right_cold]: !acceptableTemp})}>{closestDate.wind.speed} m/s</b></p>
          <p>{t("card.humidity")}: <b className={classNames(styles.card__right_wind, {[styles.card__right_cold]: !acceptableTemp})}>{closestDate.main.humidity}%</b></p>
          <p>{t("card.pressure")}: <b className={classNames(styles.card__right_wind, {[styles.card__right_cold]: !acceptableTemp})}>{closestDate.main.pressure}Pa</b></p>
        </div>
      </div>
      <p style={{ color: '#C5C5C5', fontSize: '13px' }}>{t("card.feels")}: {getCalculatedTemperature(closestDate.main.temp)} {temperatureMode === 'celsius' ? '°C' : '°F'}</p>
    </div>
  )
}

export default CityCard;
