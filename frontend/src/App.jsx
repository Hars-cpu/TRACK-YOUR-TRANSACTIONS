import React from 'react';
import { useState } from 'react'

import Layout from './components/layout.jsx'
import Dashbar from './components/dashbar.jsx'
import Dashboard from './components/dashboard.jsx'
import './App.css'
import LoginPage from './components/login'
import SignUp from './components/signup.jsx'
import { useEffect } from 'react';
import Authentication from './components/authentication.jsx';
import Axios from 'axios';
import IncomeDashboard from './components/incomes.jsx';
import { Routes,Route, Navigate } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'
import ExpenseDashboard from './components/expense.jsx';
function App() {
  const navigate = useNavigate()
  
  
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const PrivateRoute=({element})=>{
    if(isAuthenticated){
   
      return element;
    }else{
      return <Navigate to="/login" />
       
     
    }
  }
  
  
  return (
    <>
    <Authentication setisAuthenticated={setIsAuthenticated} />
    <Routes>
        <Route path='/login' element={<LoginPage />} />
        <Route path='/signup' element={<SignUp />} />
        <Route  element={<PrivateRoute element={<Layout />} />}> 
               <Route path='/' element={<Dashboard />} />
               <Route path='/incomes' element={<IncomeDashboard/>}/>
                <Route path='/expenses' element={<ExpenseDashboard/>}/>
        </Route>
    </Routes>
    </>
    

  )
}

export default App
