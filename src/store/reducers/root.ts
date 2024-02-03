import { AnyAction, combineReducers } from '@reduxjs/toolkit';

import { citiesSlice, ICitiesSlice } from './cities';

export interface StoreState {
  cities: ICitiesSlice
}

export const combinedReducers = combineReducers({
  [citiesSlice.name]: citiesSlice.reducer,
})

export type Store = ReturnType<typeof combinedReducers>;

const rootReducer = (state: Store, action: AnyAction) => combinedReducers(state, action)

export default rootReducer;
