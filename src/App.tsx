import './App.css'
import Orders from './app/orders/Orders'
import ByItem from './app/orders/ByItem'

function App() {
  return (
    <div className={'top-container'}>
      <div className={'panel'}>
        <Orders />
      </div>
      <div className={'panel'}>
        <ByItem />
      </div>
    </div>
  )
}

export default App
