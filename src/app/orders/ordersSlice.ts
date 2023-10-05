import { createSlice, nanoid, PayloadAction } from '@reduxjs/toolkit'
import { RootState } from '../store'

type OrderState = {
  id: string
  clientId: string
  date: string
  items: string[]
}

export type Order = {
  clientId: string
  items: string[]
}

const initialState = [
  //mock data
  {
    id: '1',
    clientId: 'Bartosz Dudek',
    date: '4.10.2023, 10:00:00',
    items: ['Capriciosa', 'beer'],
  },
  {
    id: '2',
    clientId: 'Piotr Wichliński',
    date: '4.10.2023, 10:15:00',
    items: ['Quattro Formaggi', 'non-alcoholic beer'],
  },
  {
    id: '3',
    clientId: 'Dawid Płatek',
    date: '4.10.2023, 10:30:00',
    items: ['Funghi', 'Long Island'],
  },
] as OrderState[] //recommended cast instead of specifying type, to prevent TS from unnecessarily narrowing the type

const ordersSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    // action case: event described in past tense
    // variant with additional pre-reducer logic in 'prepare'
    orderPlaced: {
      reducer(state, action: PayloadAction<OrderState>) {
        if (action.payload.clientId && action.payload.items.length > 0) {
          state.push(action.payload) //ONLY allowed inside createSlice() / createReducer()
        }
      },
      prepare({ clientId, items }: Order) {
        return {
          payload: {
            id: nanoid(),
            clientId: clientId,
            date: new Date().toLocaleString('pl-PL'),
            items: items,
          },
        }
      },
    },

    // simplified variant, no 'prepare' logic
    orderCanceled: (state, action: PayloadAction<string>) => {
      return state.filter((order) => order.id !== action.payload)
    },
  },
})
export const { orderPlaced, orderCanceled } = ordersSlice.actions

export const selectOrders = (state: RootState) => state.orders

export const selectOrderById = (state: RootState, orderId: string) =>
  state.orders.find((order) => order.id === orderId)

export default ordersSlice.reducer
