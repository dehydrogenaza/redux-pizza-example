import { useAppSelector } from '../hooks'
import { selectOrders } from './ordersSlice'
import Order from './Order'

const Orders = () => {
  const orders = useAppSelector(selectOrders)

  return (
    <>
      <h1>Orders</h1>
      <ul>
        {orders.map((order) => {
          return <Order key={`order-${order?.id}`} orderId={order.id} />
        })}
      </ul>
    </>
  )
}

export default Orders
