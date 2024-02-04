import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import { localStorageHelper } from './helpers/localStorageHelper';

import translation_en from '../public/locales/en/translation.json';
import translation_ua from '../public/locales/ua/translation.json';
import translation_he from '../public/locales/he/translation.json';



i18n
  .use(initReactI18next)
  .init({
    resources: {
      EN: {
        translation: translation_en
      },
      UA: {
        translation: translation_ua
      },
      HE: {
        translation: translation_he
      }
    },
    lng: localStorageHelper.getLanguage() || 'EN',

    interpolation: {
      escapeValue: false
    }
  });

export default i18n;
