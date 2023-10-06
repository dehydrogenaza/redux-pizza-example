import { useAppDispatch, useAppSelector } from '../hooks'
import { beerRequested, orderCanceled, selectOrderById } from './ordersSlice'

export interface OrderProps {
  orderId: string
}

const Order = ({ orderId }: OrderProps) => {
  const dispatch = useAppDispatch()

  const handleCancelOrder = () => {
    dispatch(orderCanceled(orderId))
  }

  const handleAddBeer = () => {
    dispatch(beerRequested(orderId))
  }

  const order = useAppSelector((state) => selectOrderById(state, orderId))

  return (
    <li>
      <p>
        <strong>Client: {order?.clientId}</strong>
      </p>
      <p>{order?.date}</p>
      <ul>{order?.items.map((item, index) => <li key={`item-${index}`}>{item}</li>)}</ul>
      <button onClick={handleCancelOrder}>Cancel</button>
      <button onClick={handleAddBeer}>Add beer</button>
    </li>
  )
}

export default Order
