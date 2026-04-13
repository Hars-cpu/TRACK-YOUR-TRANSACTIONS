import React from 'react';
import { useNavigate } from 'react-router-dom';
import Axios from 'axios';
import { backendUrl } from '../main.jsx';

const SignUp = () => {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [username, setUsername] = React.useState("");
  const [disable, setDisable] = React.useState(false);
  const navigate = useNavigate();
   const onSignUp=async()=>{
    try{
         const response=await Axios.post(`${backendUrl}/api/user/register`,{
           name: username,
           email,
           password
         });
        
          alert("Signup successful,Going to login page to login");
          setTimeout(()=>{
            navigate("/login");
          },2000);
         
    }catch(error){
      alert(error.response.data.message);
      console.error("Signup failed:", error.message);
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4 font-sans text-gray-800">
      
      {/* Main Card Container */}
      <div className="bg-white rounded-[2rem] shadow-2xl flex w-full max-w-5xl overflow-hidden min-h-[600px] border border-gray-50">
        
        {/* Left Side: Form Section */}
        <div className="w-full md:w-1/2 p-10 md:p-16 lg:p-20 flex flex-col justify-center">
          
          {/* Brand Logo */}
          <div className="flex items-center gap-2 mb-10">
            <span className="w-2.5 h-2.5 rounded-full bg-violet-500 shadow-[0_0_8px_rgba(139,92,246,0.5)]"></span>
            <span className="text-sm font-bold text-gray-700 tracking-wide uppercase">Expense</span>
          </div>

          {/* Heading */}
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-3 tracking-tight leading-tight">
            Create an<br />Account
          </h1>
          <p className="text-gray-400 text-sm mb-10 font-medium">
            Hey, welcome to your special place. Let's get started.
          </p>

          <form onSubmit={(e)=>{
            e.preventDefault();
            onSignUp();
          }} 
          className="space-y-4">
            
            {/* New Username Input */}
            <div>
              <input 
                onChange={(e)=>{
                    setUsername(e.target.value);
              }}
                type="text" 
                placeholder="Username" 
                className="w-full px-5 py-4 bg-white border border-gray-200 rounded-xl text-sm outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition-all font-medium placeholder:text-gray-400"
              />
            </div>

            {/* Email Input */}
            <div>
              <input 
                onChange={(e)=>{
                    setEmail(e.target.value);
              }}
                type="email" 
                placeholder="harsh@gmail.com" 
                className="w-full px-5 py-4 bg-white border border-gray-200 rounded-xl text-sm outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition-all font-medium placeholder:text-gray-400"
              />
            </div>

            {/* Password Input */}
            <div>
              <input 
              onChange={(e)=>{
                    setPassword(e.target.value);
              }}
                type="password" 
                placeholder="password123" 
                className="w-full px-5 py-4 bg-white border border-gray-200 rounded-xl text-sm outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition-all font-medium placeholder:text-gray-400"
              />
            </div>

            {/* Options (Terms & Conditions) */}
            <div className="flex items-center justify-between pt-3">
              <label className="flex items-center gap-3 cursor-pointer group">
                <div className="relative flex items-center justify-center">
                  <input onChange={(e)=>{
                    setDisable(!e.target.checked);
                  }}
                  
                    type="checkbox" 
                    className="peer appearance-none w-5 h-5 border-2 border-gray-300 rounded-[5px] checked:bg-violet-500 checked:border-violet-500 transition-colors cursor-pointer" 
                  />
                  <svg className="absolute w-3 h-3 text-white opacity-0 peer-checked:opacity-100 pointer-events-none stroke-current stroke-2" fill="none" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"></path>
                  </svg>
                </div>
                <span className="text-sm font-medium text-gray-500 group-hover:text-gray-700 transition-colors">
                  I agree to the Terms
                </span>
              </label>
            </div>

            {/* Submit Button */}
        {  
            
            <button 
            disabled={disable}

              type="submit" 
              className="w-full md:w-3/4 lg:w-32 bg-gradient-to-r from-violet-500 to-indigo-500 hover:from-violet-600 hover:to-indigo-600 text-white font-semibold py-3.5 px-6 rounded-xl shadow-[0_8px_20px_-6px_rgba(139,92,246,0.5)] hover:shadow-[0_12px_24px_-8px_rgba(139,92,246,0.6)] hover:-translate-y-0.5 active:translate-y-0 active:shadow-[0_4px_10px_-4px_rgba(139,92,246,0.5)] transition-all duration-200 mt-8 block"
            >
              Sign Up
            </button>
            
            }
          </form>

          {/* Footer Link */}
          <p className="text-sm text-gray-400 mt-10 font-medium">
            Already have an account?{' '}
            <button onClick={() => navigate("/login")} className="text-violet-500 font-bold hover:text-violet-600 hover:underline">
              Sign In
            </button>
          </p>
        </div>

        {/* Right Side: Illustration Section */}
        {/* Hidden on mobile (md:flex) */}
        <div className="hidden md:flex w-1/2 bg-[#8C52FF] flex-col items-center justify-center relative overflow-hidden group">
          
          {/* Floating 'Check' Bubble Effect (similar to image) */}
          <div className="absolute left-12 md:left-24 top-1/3 w-14 h-14 bg-white rounded-full flex items-center justify-center shadow-2xl z-20 animate-bounce" style={{ animationDuration: '3s' }}>
            <svg className="w-7 h-7 text-violet-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          
          {/* Main Illustration Area Container */}
          {/* You can replace this inner div with a real <img src="..." /> tag */}
          <div className="relative w-[360px] h-[360px] flex items-center justify-center transition-transform duration-700 group-hover:scale-105">
             <img
            src="https://cdn.dribbble.com/userupload/14898990/file/original-ba68e98ea10e1867e831884c3b153387.png?resize=1024x768&vertical=center"
            alt="phone"
            className="relative z-10 w-[340px] mx-auto mt-[150px]"
          />


             {/* Floating 'Lock' Bubble Effect */}
             <div className="absolute -right-8 bottom-1/4 w-20 h-24 bg-white rounded-2xl shadow-2xl flex items-center justify-center z-20">
               <svg className="w-10 h-10 text-violet-400" fill="currentColor" viewBox="0 0 20 20">
                 <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
               </svg>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};

export default SignUp;
