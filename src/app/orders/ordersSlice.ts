import {
  createAsyncThunk,
  createSelector,
  createSlice,
  nanoid,
  PayloadAction,
} from '@reduxjs/toolkit'
import { RootState } from '../store'

type OrderState = {
  data: Order[]
  status: 'idle' | 'pending' | 'fulfilled' | 'rejected'
  error?: string
}

export type Order = {
  id: string
  clientId: string
  date: string
  items: string[]
}

export type NewOrder = {
  clientId: string
  items: string[]
}

//mock data
const initialState = {
  data: [
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
  ],
  status: 'idle',
} as OrderState //recommended cast instead of specifying type, to prevent TS from unnecessarily narrowing the type

// any async actions (in fact any side effects at all) are NOT allowed in reducers, but they can be wrapped in thunks
export const fakeFetchOrders = createAsyncThunk('orders/fetchedMore', async () => {
  return await delayedCreateOrder(2000)
})

const ordersSlice = createSlice({
  name: 'orders',
  initialState,
  // action cases are named as events in past tense
  reducers: {
    // variant with additional pre-reducer logic in 'prepare'
    orderPlaced: {
      reducer(state, action: PayloadAction<Order>) {
        if (action.payload.clientId && action.payload.items.length > 0) {
          state.data.push(action.payload) //draft state "mutation" ONLY allowed inside createSlice() / createReducer()
        }
      },
      prepare({ clientId, items }: NewOrder) {
        return {
          payload: prepareNewOrder(clientId, items),
        }
      },
    },

    // simplified variant, no 'prepare' logic
    orderCanceled: (state, action: PayloadAction<string>) => {
      state.data = state.data.filter((order) => order.id !== action.payload)
    },
    beerRequested: (state, action: PayloadAction<string>) => {
      const existingOrder = state.data.find((order) => order.id === action.payload)
      if (existingOrder) {
        existingOrder.items.push('beer')
      }
    },
  },
  extraReducers(builder) {
    builder
      .addCase(fakeFetchOrders.pending, (state) => {
        state.status = 'pending'
      })
      .addCase(fakeFetchOrders.fulfilled, (state, action) => {
        state.status = 'fulfilled'
        state.data.push(prepareNewOrder(action.payload.clientId, action.payload.items))
      })
      .addCase(fakeFetchOrders.rejected, (state, action) => {
        state.status = 'rejected'
        state.error = action.error.message
      })
  },
})
export const { orderPlaced, orderCanceled, beerRequested } = ordersSlice.actions

export const selectOrders = (state: RootState) => state.orders.data
export const selectStatus = (state: RootState) => state.orders.status
export const selectError = (state: RootState) => state.orders.error // not currently implemented, but can be used to extract info from rejected Promises

export const selectOrderById = (state: RootState, orderId: string) =>
  state.orders.data.find((order) => order.id === orderId)
// this will cause unnecessary re-renders with *each* update
// export const selectOrdersByItem = (state: RootState, item: string) =>
//   state.orders.filter((order) => order.items.includes(item))

// the solution is to memoize selectors using 'createSelector()'
export const selectOrdersByItem = createSelector(
  selectOrders,
  (_: RootState, itemName: string) => itemName,
  (orders: Order[], itemName: string) =>
    orders.filter((order) => includesIgnoreCase(order, itemName)),
)

export default ordersSlice.reducer

// HELPER FUNCTIONS, NOT RELATED TO REDUX
const prepareNewOrder = (clientId: string, items: string[]): Order => {
  return {
    id: nanoid(),
    clientId: clientId,
    date: new Date().toLocaleString('pl-PL'),
    items: items,
  }
}

const includesIgnoreCase = (order: Order, itemName: string): boolean => {
  return order.items.some((item) => item.toLowerCase() === itemName.toLowerCase())
}

const delayedCreateOrder = async (ms: number) => {
  await new Promise((callback) => setTimeout(callback, ms)) // fake delay

  return Promise.resolve({
    clientId: 'Bartosz Dudek',
    items: ['beer'],
  } as NewOrder)
}
