import React, {useEffect, useState} from 'react';
import {Autocomplete, TextField} from '@mui/material';

import { useAppDispatch } from '../../../store/hooks';
import { getCitiesSlice, setCityNameSlice } from '../../../store/slices/cities.ts';
import { ICity } from '../../../types/cities/cities';
import useDebounce from '../../../hooks/useDebounce/useDebounce';

import styles from './SearchCity.module.scss';

const SearchCity: React.FC = () => {
  const [selectOption, setSelectOption] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [cities, setCities] = useState<ICity[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const dispatch = useAppDispatch()

  const debouncedInput = useDebounce(searchTerm, 500)

  useEffect(() => {
    (async () => {
      if (!debouncedInput) return
      setIsLoading(true);

      // TODO: add ts
      const response = await dispatch(getCitiesSlice(searchTerm))
      if (response?.payload) {
        setCities(response.payload);
      }

      setIsLoading(false);
    })();

  }, [debouncedInput])

  const handleAddCity = async () => {
    if (!selectOption) return;

    await dispatch(setCityNameSlice(selectOption));
    setSelectOption(null);
    setSearchTerm('');
  }

  return (
    <div className={styles.searchCity}>
      <Autocomplete
        loading={isLoading}
        id="combo-box-demo"
        options={cities.map(city => `${city.name}, ${city.countryCode}`)}
        freeSolo
        onChange={(_, value) => value && setSelectOption(value)}
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
      <button className={styles.searchCity__button} onClick={handleAddCity} disabled={!selectOption}>
        Add
      </button>
    </div>
  )
}

export default SearchCity;
