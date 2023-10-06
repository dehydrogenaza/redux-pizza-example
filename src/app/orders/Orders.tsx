import { useAppDispatch, useAppSelector } from '../hooks'
import { fakeFetchOrders, selectOrderIds, selectStatus } from './ordersSlice'
import Order from './Order'
import PlaceOrderForm from './PlaceOrderForm'

const Orders = () => {
  const dispatch = useAppDispatch()

  const orderIds = useAppSelector(selectOrderIds)
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
        {orderIds.map((orderId) => {
          return <Order key={`order-${orderId}`} orderId={orderId.toString()} />
        })}
      </ul>
      <hr />
      {renderedFetchSection}
    </>
  )
}

export default Orders
