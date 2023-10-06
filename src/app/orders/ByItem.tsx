import Order from './Order'
import { useAppSelector } from '../hooks'
import { selectOrdersByItem } from './ordersSlice'
import { useState } from 'react'

const ByItem = () => {
  const [itemName, setItemName] = useState<string>('')

  const ordersByItem = useAppSelector((state) => selectOrdersByItem(state, itemName))

  return (
    <>
      <form>
        <label htmlFor={'byItemFilter'}>Item name: </label>
        <input
          type='text'
          id={'byItemFilter'}
          name={'byItemFilter'}
          placeholder={'Enter item name...'}
          value={itemName}
          onChange={(e) => setItemName(e.target.value)}
        />
      </form>
      {itemName ? (
        <>
          <h1>Orders including &apos;{itemName}&apos;</h1>
          <ul>
            {ordersByItem.map((order) => {
              return <Order key={`filteredOrder-${order?.id}`} orderId={order.id} />
            })}
          </ul>
        </>
      ) : (
        <p>Choose an item to filter by...</p>
      )}
    </>
  )
}
export default ByItem
