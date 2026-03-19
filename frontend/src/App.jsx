import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import heroImg from './assets/hero.png'
import './App.css'
import LoginPage from './components/login'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
    <LoginPage></LoginPage>
    </>

  )
}

export default App
