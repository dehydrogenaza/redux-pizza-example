import {
  createAsyncThunk,
  createEntityAdapter,
  createSelector,
  createSlice,
  nanoid,
  PayloadAction,
} from '@reduxjs/toolkit'
import { RootState } from '../store'

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

type FetchStatus = {
  status: string
  error?: string
}

const ordersAdapter = createEntityAdapter<Order>({
  selectId: (order) => order.id,
})

const emptyInitialState = ordersAdapter.getInitialState({
  status: 'idle',
  error: undefined,
} as FetchStatus)

//mock data
const initialState = ordersAdapter.upsertMany(emptyInitialState, [
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
])

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
          ordersAdapter.addOne(state, action.payload) //draft state "mutation" ONLY allowed inside createSlice() / createReducer()
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
      ordersAdapter.removeOne(state, action.payload)
    },

    beerRequested: (state, action: PayloadAction<string>) => {
      const existingOrder = state.entities[action.payload]
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
        ordersAdapter.addOne(state, prepareNewOrder(action.payload.clientId, action.payload.items))
      })
      .addCase(fakeFetchOrders.rejected, (state, action) => {
        state.status = 'rejected'
        state.error = action.error.message
      })
  },
})
export const { orderPlaced, orderCanceled, beerRequested } = ordersSlice.actions
export const selectStatus = (state: RootState) => state.orders.status
export const selectError = (state: RootState) => state.orders.error // not currently implemented, but can be used to extract info from rejected Promises

export const {
  selectAll: selectOrders,
  selectById: selectOrderById,
  selectIds: selectOrderIds,
} = ordersAdapter.getSelectors((state: RootState) => state.orders)

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
