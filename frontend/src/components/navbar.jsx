import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import { ChevronDown } from 'lucide-react';
import axios from 'axios';
import { backendUrl } from '../main.jsx';
function Navbar({user}) {
  const navigate = useNavigate();
  
   const [open, setOpen] = React.useState(false);
  const dropdownRef = React.useRef();
  
  
  
 const {name:username="User",email="hr7650074@gmail.com"}=user||{};
   const initial=username.charAt(0).toUpperCase()||"U";

  useEffect(()=>{
    const fetchUserData=async ()=>{
       try{
         const token=localStorage.getItem('token');
         if(!token)return;

         const response=await axios.get(`${backendUrl}/api/user/profile`, {
           headers: {
             Authorization: `Bearer ${token}`
           }
                      
         });
         const userData=response.data.user||response.data;
         if(userData){
           user=userData;
         }
       } catch (error) {
         console.error('Error fetching user data:', error.message);
       }

       if(!user){
         fetchUserData();
       }
    }
  },[user]);

  const handleLogout=()=>{
     localStorage.removeItem('token');
     localStorage.removeItem('user');
     
     navigate('/login');
  }
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {

      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [dropdownRef]);

  return (
      
    <div className="w-full h-25 flex justify-center mt-6">
      <nav className="flex items-center justify-around w-full bg-white px-3 py-1 rounded-full shadow-sm border border-gray-100">
        
        
        <div onClick={() => navigate('/')} className="flex items-center gap-2 cursor-pointer font-semibold text-gray-900">
           <img src="image2.png" alt="Logo" className='w-45 h-35'  />
          
        </div>

       {user&&(
            <div className="relative" ref={dropdownRef}>
              
              {/* USER BUTTON */}
              <div
                onClick={() => setOpen(!open)}
                className="flex items-center gap-3 cursor-pointer"
              >
                {/* Avatar */}
                <div className="w-10 h-10 bg-orange-500 text-white flex items-center justify-center rounded-full font-semibold">
                  {initial}
                </div>
        
                {/* Text */}
                <div className="text-left">
                  <p className="text-sm font-medium text-gray-800">{user.name || "User"}</p>
                  <p className="text-xs text-gray-500">{user.email || "hr7650074@gmail.com"}</p>
                </div>
        
                {/* Dropdown Icon */}
                <ChevronDown
                  className={`w-4 h-4 text-gray-500 transition-transform duration-300 ${
                    open ? "rotate-180" : ""
                  }`}
                />
              </div>
        
              {/* DROPDOWN MENU */}
              {open && (
                <div className="absolute right-0 mt-3 w-64 bg-white rounded-xl shadow-lg border border-gray-100 p-4 z-50">
                  
                  {/* User Info */}
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 bg-orange-500 text-white flex items-center justify-center rounded-full font-semibold">
                      {initial}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-800">{user.name || "User"}</p>
                      <p className="text-xs text-gray-500">
                        {user.email || "hr7650074@gmail.com"}
                      </p>
                    </div>
                  </div>
        
                  <div className="border-t my-2"></div>
        
                  {/* Options */}
                  <button  onClick={() => {navigate('/profile')
                    setOpen(false);}
                  } className="w-full text-left px-3 py-2 text-sm rounded-lg hover:bg-gray-100">
                    👤 Profile
                  </button>
        
                  
        
                  <button onClick={()=>{
                    handleLogout();
                    setOpen(false);
                  }}className="w-full text-left px-3 py-2 text-sm rounded-lg hover:bg-gray-100 text-red-500">
                    🚪 Logout
                  </button>
                </div>
              )}
            </div>
        )}




      </nav>
    </div>
  );
  
}

export default Navbar