import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import translation_en from '../public/locales/en/translation.json';
import translation_uk from '../public/locales/uk/translation.json';
import {localStorageHelper} from "./helpers/localStorageHelper";


i18n
  .use(initReactI18next)
  .init({
    resources: {
      EN: {
        translation: translation_en,
      },
      UK: {
        translation: translation_uk,
      }
    },
    lng: localStorageHelper.getLanguage() || 'EN',

    interpolation: {
      escapeValue: false
    }
  });

export default i18n;
