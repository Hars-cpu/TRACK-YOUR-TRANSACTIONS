import React from 'react'
import { backendUrl } from '../main'
import axios from 'axios';
function Exporting() {

  
    
    const fetching=async()=>{

        try{
    const token=localStorage.getItem('token');
    const headers=token?{
      Authorization:`Bearer ${token}`
    }:{};
    console.log(headers);
    const res=await axios.get(`${backendUrl}/api/expense/export`,{
        headers:headers,
        responseType: 'blob'
    },

    );
   
    console.log(res);
console.log(res.data);
console.log(new Blob([res.data]));
  
  
    
const url = window.URL.createObjectURL(new Blob([res.data]));
    const a = document.createElement("a");
    a.href = url;
    a.download = "expenses.xlsx"; // file name
    document.body.appendChild(a);
    a.click();
    a.remove();

    window.URL.revokeObjectURL(url);
   
}catch(error){
    console.log(error);
}

}
  

  return (
   <div className='w-screen h-screen flex justify-center align-center '> 
   <div>exporting</div>
    <button onClick={()=>{
        fetching()
    }} className='w-[100px] h-[100px] hover:bg-amber-500 bg-amber-400 cursor-pointer '>export</button>
</div>
  )
}

export default Exporting