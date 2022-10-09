import { useState } from 'react'
import logo from './logo.svg'
import './App.css'
import Debounce from './components/Debounce'
import Loader1 from './components/Loader1'

function App() {
  const [count, setCount] = useState(0)
  const [load, setLoad] = useState(true)

  setTimeout(()=>{
    setLoad(false)
  },500)

  return (
    <>

      <div className='container'>
      {load ? <Loader1/> : <Debounce/>}
      </div>
      
    </>
  )
}

export default App
