import React, { use } from "react";
import { backendUrl } from "../main.jsx";
import Axios from "axios";
import { useNavigate } from "react-router-dom";
import {useEffect} from "react";
export default function LoginPage() {
    const [email,setEmail]=React.useState("");
    const [password,setPassword]=React.useState("");
    const navigate=useNavigate();

    
  const onLogin=async()=>{
    try{
      console.log("Email:", email, "Password:", password, "User:", );
         const response=await Axios.post(`${backendUrl}/api/user/login`,{
           email,
           password
         });
         
         localStorage.setItem("token", response.data.token);
         localStorage.setItem("user", JSON.stringify(response.data.user));
          alert("Login successful");
          setTimeout(()=>{
            navigate("/");
          },1000);
        
    }catch(error){
      console.log("Login failure:", error.message);
    }
  }

  return (
    <div className="min-h-screen bg-[#e9e9eb] flex items-center justify-center p-6">
      <div className="w-full max-w-6xl bg-white rounded-[24px] shadow-[0_20px_60px_rgba(0,0,0,0.15)] grid grid-cols-1 md:grid-cols-2 overflow-hidden">
        
        {/* LEFT */}
        <div className="px-12 py-14 flex flex-col justify-center">
          
          {/* Logo */}
          <div className="flex items-center gap-2 mb-10">
            <div className="w-2.5 h-2.5 bg-purple-600 rounded-sm"></div>
            <span className="text-[14px] text-gray-700 font-medium">Expense</span>
          </div>

          {/* Heading */}
          <h1 className="text-[38px] font-bold leading-tight text-gray-900">
            Hello,<br />Welcome Back
          </h1>

          <p className="text-gray-400 text-[14px] mt-3 mb-10">
            Hey, welcome back to your special place
          </p>

          {/* Email */}
          <input onChange={(e)=>{
             setEmail(e.target.value);
          }} 
          value={email}
            type="email"
            placeholder="harsh@gmail.com"
            className="w-full h-[48px] px-4 mb-4 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
          />

          {/* Password */}
          <input onChange={(e)=>{
             setPassword(e.target.value);
          }}
          value={password}
            type="password"
            placeholder="password123"
            className="w-full h-[48px] px-4 mb-4 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
          />

          {/* Row */}
          <div className="flex items-center justify-between mb-8 text-[13px]">
            <label className="flex items-center gap-2 text-gray-500">
              <input
                type="checkbox"
                className="accent-purple-600 w-4 h-4"
                defaultChecked
              />
              Remember me
            </label>

            <span className="text-gray-400 cursor-pointer hover:text-purple-600">
              Forgot Password?
            </span>
          </div>

          {/* Button */}
          <button onClick={()=>{
            onLogin();
          }} className="w-[120px] h-[44px] rounded-lg text-white text-sm font-medium bg-gradient-to-r from-purple-600 to-indigo-500 shadow-md hover:opacity-70 transition">
            Sign In
          </button>

          {/* Footer */}
          <p className="text-[12px] text-gray-400 mt-10">
            Don’t have an account?{" "}
            <span onClick={() => navigate("/signup")} className="text-purple-600 cursor-pointer">Sign Up</span>
          </p>
        </div>

        {/* RIGHT */}
        <div className="relative hidden md:block">
          
          {/* Gradient Background */}
          <div className="absolute inset-0 bg-gradient-to-br from-[#7b5cff] to-[#a855f7]"></div>

          
          

          {/* Main Illustration */}
          <img
            src="https://cdn.dribbble.com/userupload/14898990/file/original-ba68e98ea10e1867e831884c3b153387.png?resize=1024x768&vertical=center"
            alt="phone"
            className="relative z-10 w-[340px] mx-auto mt-[150px]"
          />

         

          {/* Check bubble */}
          <div className="absolute left-16 top-1/3 bg-white rounded-full px-4 py-2 shadow-md">
            ✔
          </div>
        </div>

      </div>
    </div>
  );
}