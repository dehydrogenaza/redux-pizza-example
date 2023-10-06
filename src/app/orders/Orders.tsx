import { useAppDispatch, useAppSelector } from '../hooks'
import { fakeFetchOrders, selectOrders, selectStatus } from './ordersSlice'
import Order from './Order'
import PlaceOrderForm from './PlaceOrderForm'

const Orders = () => {
  const dispatch = useAppDispatch()

  const orders = useAppSelector(selectOrders)
  const ordersStatus = useAppSelector(selectStatus)

  const handleFetchNewOrders = async () => {
    try {
      await dispatch(fakeFetchOrders())
    } catch (e) {
      console.error('Failed to fetch with exception: ', e)
    }
  }

  const renderedFetchSection =
    ordersStatus === 'pending' ? (
      <p style={{ color: 'darkgray' }}>Loading...</p>
    ) : (
      <button onClick={handleFetchNewOrders}>Fetch from server</button>
    )

  return (
    <>
      <PlaceOrderForm />
      <h1>All orders</h1>
      <ul>
        {orders.map((order) => {
          return <Order key={`order-${order?.id}`} orderId={order.id} />
        })}
      </ul>
      <hr />
      {renderedFetchSection}
    </>
  )
}

export default Orders
