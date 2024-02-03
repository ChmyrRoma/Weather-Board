import { TypedUseSelectorHook, useSelector, useDispatch } from 'react-redux'
import type { StoreType, AppDispatch } from './store'

export const useAppSelector: TypedUseSelectorHook<StoreType> = useSelector;

export const useAppDispatch = () => useDispatch<AppDispatch>()
