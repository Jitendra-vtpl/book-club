import { configureStore } from '@reduxjs/toolkit'
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux'

// slices
import authReducer from './slices/authSlice'
import bookReducer from './slices/bookSlice'
import readlistReducer from './slices/readlistSlice'

const rootReducer = (state: any, action: any) => {  
  if (action.type === 'RESET_ALL_SLICES') {
    return {
      auth: authReducer(undefined, action),
      book: bookReducer(undefined, action),
      readlist: readlistReducer(undefined, action),
    }
  }
  
  return {
    auth: authReducer(state?.auth, action),
    book: bookReducer(state?.book, action),
    readlist: readlistReducer(state?.readlist, action),
  }
}

export const store = configureStore({
  reducer: rootReducer,
})

// Utility function to reset all slices
export const resetAllSlices = () => {
  return {
    type: 'RESET_ALL_SLICES',
  }
}

export const useAppDispatch: () => typeof store.dispatch = useDispatch
export const useAppSelector: TypedUseSelectorHook<typeof store.getState> = useSelector 
