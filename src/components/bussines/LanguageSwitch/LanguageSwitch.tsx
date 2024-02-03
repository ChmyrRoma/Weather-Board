import React, { useState } from 'react';
import i18next from 'i18next';
import { Box, Menu, MenuItem } from '@mui/material';

import LanguageIcon from '@mui/icons-material/Language';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';

import styles from './LanguageSwitch.module.scss';
import {localStorageHelper} from "../../../helpers/localStorageHelper";

const LanguageSwitch = () => {
  const [open, setOpen] = useState<boolean>(false);
  const [target, setTarget] = useState<Element | (() => Element) | undefined>();

  const handleOpen = (event: React.MouseEvent<HTMLButtonElement>) => {
    setTarget(event.currentTarget);
    setOpen(prev => !prev);
  };

  const handleClose = () => setOpen(false);

  const handleCloses = (language: string) => {
    setOpen(false);
    localStorageHelper.setLanguage(language)
    i18next.changeLanguage(language);
  }

  return (
    <Box className={styles.lngsSwitch}>
      <Box onClick={handleOpen} className={styles.lngsSwitch__button}>
        <LanguageIcon fontSize="small" />
        {i18next.language}
        { open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon /> }
      </Box>
      <Menu
        id="basic-menu"
        anchorEl={target}
        sx={{ marginTop: '5px' }}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        open={Boolean(open)}
        onClose={handleClose}
      >
        <MenuItem onClick={() => handleCloses('EN')} sx={{ width: '70px' }}>EN</MenuItem>
        <MenuItem onClick={() => handleCloses('UK')}>UA</MenuItem>
      </Menu>
    </Box>
  )
}

export default LanguageSwitch;
