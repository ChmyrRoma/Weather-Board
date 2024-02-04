import React from 'react'

import MainLayout from './components/layouts/MainLayout/MainLayout';
import LanguageSwitch from './components/bussines/LanguageSwitch/LanguageSwitch';
import SearchCity from './components/bussines/SearchCity/SearchCity';
import CitiesContainer from './components/bussines/CitiesContainer/CitiesContainer';

import './index.css';
import './i18n';

const App: React.FC = () => (
  <MainLayout>
    <LanguageSwitch />
    <SearchCity />
    <CitiesContainer />
  </MainLayout>
);

export default App
