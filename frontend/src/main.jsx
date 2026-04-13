import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import Navbar from './components/navbar.jsx'
import './index.css'
import App from './App.jsx'
import {BrowserRouter} from 'react-router-dom'
import Dashbar from './components/dashbar.jsx'
import LoginPage from './components/login.jsx'
import SignUp from './components/signup.jsx'
import Exporting from './components/exporting.jsx'
export const backendUrl='https://track-your-transactions-backend.onrender.com';
createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <App></App>
  </BrowserRouter>
)
