import React, { use, useEffect } from 'react'
import { useNavigate,useLocation } from 'react-router-dom';
import Axios from 'axios';
import { backendUrl } from '../main.jsx';
import {jwtDecode } from 'jwt-decode';
function Authentication({setisAuthenticated}) {
    const navigate = useNavigate();
    const location=useLocation();
    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            const decoded=jwtDecode(token);
            const currentTime = Date.now() / 1000;
            const renmainTime = decoded.exp - currentTime;
            if (renmainTime < 0) {
                localStorage.removeItem("token");
                localStorage.removeItem("user");
                setisAuthenticated(false);
                
            }
            setisAuthenticated(true);
            if(location.pathname==="/login" || location.pathname==="/signup"){
                navigate("/");
            }
          
        }
      }, [location.pathname]);
    
  return (
    null
  )
}


export default Authentication