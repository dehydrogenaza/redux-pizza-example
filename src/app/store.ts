import { configureStore } from '@reduxjs/toolkit'
import ordersReducer from './orders/ordersSlice'

export const store = configureStore({
  reducer: {
    orders: ordersReducer,
    // products: productsReducer,
    // reviews: reviewsReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>

export type AppDispatch = typeof store.dispatch
