import React, { useEffect, useState } from 'react';
import { Autocomplete, TextField } from '@mui/material';
import { useTranslation } from 'react-i18next';
import classNames from 'classnames';

import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import { getCitiesSlice, setCityNameSlice } from '../../../store/slices/cities.ts';
import { ICity } from '../../../types/cities/cities';
import useDebounce from '../../../hooks/useDebounce/useDebounce';

import styles from './SearchCity.module.scss';


const SearchCity: React.FC = () => {
  const [selectOption, setSelectOption] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [cities, setCities] = useState<ICity[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const { t } = useTranslation()

  const { citiesWithWeather } = useAppSelector(state => state.cities)

  const dispatch = useAppDispatch()

  const debouncedInput = useDebounce(searchTerm, 500)

  useEffect(() => {
    (async () => {
      if (!debouncedInput) return
      setIsLoading(true);

      const response = await dispatch(getCitiesSlice(searchTerm))
      if (response?.payload) {
        setCities(response.payload);
      }

      setIsLoading(false);
    })();

  }, [debouncedInput])


  useEffect(() => {
    const checkCity = citiesWithWeather.some(item => item.name === selectOption)
    if (checkCity) return;
  }, [citiesWithWeather])

  useEffect(() => {
    if (selectOption !== searchTerm) {
      setSelectOption(null)
    }
  }, [searchTerm])

  const handleAddCity = async () => {
    if (!selectOption) return;
    const checkCity = citiesWithWeather.some(item => item.name === selectOption)
    if (checkCity) return;
    await dispatch(setCityNameSlice({ name: selectOption }));
    setSearchTerm('');
    setSelectOption('');
  }

  return (
    <div className={styles.searchCity}>
      <Autocomplete
        loading={isLoading}
        loadingText={t('loading')}
        clearIcon={false}
        id="combo-box-demo"
        options={searchTerm ? cities.map(city => `${city.name}, ${city.countryCode}`) : []}
        freeSolo
        value={selectOption}
        onChange={(_, value) => (value && setSelectOption(value))}
        sx={{ width: 450 }}
        renderInput={(params) => (
          <TextField
            {...params}
            onChange={(e) => setSearchTerm(e.target.value)}
            value={searchTerm}
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              height: '40px',
              borderRadius: '8px',
              boxShadow: '1px 0px 4px 1px #d1cdcd',
              "& .MuiOutlinedInput-root": {
                border: 'none',
                outlined: 'none',
                '& fieldset': {
                  border: 'none'
                },
                '&:hover fieldset': {
                  borderColor: 'none',
                },
                "&.Mui-focused fieldset": {
                  borderColor: "none",
                },
              },
            }}
          />
        )}
      />
      <button
        className={classNames(styles.searchCity__button, {
          [styles.searchCity__button_disabled]: !selectOption
        })}
        onClick={handleAddCity}
        disabled={!selectOption}
      >
        {t('button')}
      </button>
    </div>
  )
}

export default SearchCity;
