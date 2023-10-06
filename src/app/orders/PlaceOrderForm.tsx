import { useState } from 'react'
import { useAppDispatch } from '../hooks'
import { orderPlaced } from './ordersSlice'

const PlaceOrderForm = () => {
  const dispatch = useAppDispatch()

  const [newItem, setNewItem] = useState<string>('')
  const [orderItems, setOrderItems] = useState<string[]>([])
  const [clientId, setClientId] = useState<string>('')

  const handlePlaceOrder = () => {
    dispatch(orderPlaced({ clientId: clientId, items: orderItems }))
  }

  const handleAddItemToOrder = () => {
    newItem && setOrderItems((items) => [...items, newItem])
    setNewItem('')
  }

  const canPlaceOrder = (): boolean => {
    return !!clientId && orderItems.length > 0
  }

  return (
    <>
      <form>
        <div>
          <label htmlFor={'orderClientId'}>Client: </label>
          <input
            type='text'
            id={'orderClientId'}
            name={'orderClientId'}
            placeholder={'Enter client name...'}
            value={clientId}
            onChange={(e) => setClientId(e.target.value)}
          />
        </div>
        <div>
          {orderItems.map((item, index) => (
            <p key={`newItem-${index}`}>- {item}</p>
          ))}
        </div>
        <div>
          <label htmlFor={'orderItem'}>Add item: </label>
          <input
            type='text'
            id={'orderItem'}
            name={'orderItem'}
            placeholder={'Enter ordered item...'}
            value={newItem}
            onChange={(e) => setNewItem(e.target.value)}
          />
          <button type={'button'} onClick={handleAddItemToOrder}>
            +
          </button>
        </div>
      </form>
      {canPlaceOrder() && <button onClick={handlePlaceOrder}>Place order</button>}
    </>
  )
}
export default PlaceOrderForm
