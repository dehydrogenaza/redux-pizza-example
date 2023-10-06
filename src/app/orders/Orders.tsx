import { useAppSelector } from '../hooks'
import { selectOrders } from './ordersSlice'
import Order from './Order'
import PlaceOrderForm from './PlaceOrderForm'

const Orders = () => {
  const orders = useAppSelector(selectOrders)

  return (
    <>
      <PlaceOrderForm />
      <h1>All orders</h1>
      <ul>
        {orders.map((order) => {
          return <Order key={`order-${order?.id}`} orderId={order.id} />
        })}
      </ul>
    </>
  )
}

export default Orders
