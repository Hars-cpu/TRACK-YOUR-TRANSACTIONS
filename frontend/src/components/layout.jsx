import { Outlet } from "react-router-dom";
import Navbar from "./navbar";
import Sidebar from "./sidebar";
import { PiggyBank, Utensils,Gift, Zap,Activity,ArrowUp,Car,Home, CreditCard } from "lucide-react";
import axios from "axios";
import { useMemo } from "react";
import RecentTransactions from "./recentTransactions";
import ExpenseDistribution from "./categoryDistribution";
import SpendByCategory from "./expenseDistribution";
import { use } from "react";
import { backendUrl } from "../main";
import { useState, useEffect } from "react";
import { time } from "framer-motion";

 const CATEGORY_ICONS={
    food:<Utensils className="w-4 h-4"/>,
     Housing:<Home className="w-4 h-4"/>,
     Transport:<Car className="w-4 h-4"/>,
    //  Shopping:<Shopping className="w-4 h-4"/>,
     Entertainment:<Gift className="w-4 h-4"/>,
     Utilities:<Zap className="w-4 h-4"/>,
     HealthCare:<Activity className="w-4 h-4"/>,
     Salary:<ArrowUp className="w-4 h-4"/>,
     FreeLancing:<CreditCard className="w-4 h-4"/>,
     Savings:<PiggyBank className="w-4 h-4"/>,

  }

  

  const safeArrayFromResponse=(res)=>{
    const body=res?.data;
    if(!body)return [];
    if(Array.isArray(body))return body;
    if(Array.isArray(body.data))return body.data;
    if(Array.isArray(body.incomes))return body.incomes;
    if(Array.isArray(body.expenses))return body.expenses;
    return [];
  }

function Layout() {
  const [user,setUser]=useState({});
    const [transactions,setTransactions]=useState([]);
    const [timeFrame, setTimeFrame]=useState("");
const [loading,setLoading]=useState(false);
const [showAllTransactions,setShowAllTransactions]=useState(false);
const [lastUpdated,setLastUpdated]=useState(false);
const [sidebarcollapsed,setSidebarCollapsed]=useState(false);
 

  const fetchTransactions=async()=>{
    try{
    setLoading(true);
    const token=localStorage.getItem('token');
    const headers=token?{
      Authorization:`Bearer ${token}`
    }:{};
    const [incomeRes,expenseRes]=await Promise.all([
      axios.get(`${backendUrl}/api/income/all`,{headers:headers}),
      axios.get(`${backendUrl}/api/expense/all`,{headers:headers}),
    ]);
   const incomes=safeArrayFromResponse(incomeRes).map((i)=>({
      ...i,type:"income"
   }));
   const expenses=safeArrayFromResponse(expenseRes).map((e)=>({
      ...e,type:"expense"
   }));


  

  const allTranscations=[...incomes,...expenses]
  .map((t)=>({
     id:t._id||t.id||t.id_str||Math.random().toString(36).slice(2),
      description:t.description||t.title||t.note||"",
      amount:t.amount!=null?Number(t.amount):Number(t.value||0),
      date:t.date||t.createdAt||new Date().toISOString(),
      category:t.category||t.type||"Other",
      type:t.type,
      raw:t,
  })).sort((a,b)=>new Date(b.date)-new Date(a.date));
  
  
  setTransactions(allTranscations);
  setLastUpdated(new Date());
}catch(error){
  console.log("Error fetching transactions:", error.message);
}finally{
  setLoading(false);
}
}

const addTransaction=async(transaction)=>{

  try{
    const token=localStorage.getItem('token');
    const headers=token?{
      Authorization:`Bearer ${token}`
    }:{};
    const endpoint=transaction.type==="income"?"/api/income/add":"/api/expense/add";
    const res=await axios.post(`${backendUrl}${endpoint}/`,transaction,{headers});
    await fetchTransactions();
    return true;
  }catch(error){
    console.log("Error adding transaction:", error.message);

    throw error;
}
}

const editTransaction=async(id,transaction)=>{
  try{
    const token=localStorage.getItem('token');
    const headers=token?{
      Authorization:`Bearer ${token}`
    }:{};
    const endpoint=transaction.type==="income"?"/api/income/update/":"/api/expense/update/";
    const res=await axios.put(`${backendUrl}${endpoint}${id}`,transaction,{headers});
    await fetchTransactions();
    return true;
  }catch(error){
    console.log("Error editing transaction:", error.message);
    throw error;
}
}

const deleteTranscation=async(id,type)=>{
         try{
          const token=localStorage.getItem('token');
          const headers=token?{
            Authorization:`Bearer ${token}`
          }:{};
          const endpoint=type==="income"?"/api/income/delete/":"/api/expense/delete/";
          const res=await axios.delete(`${backendUrl}${endpoint}${id}`,{headers});
          await fetchTransactions();
          return true;

          }catch(error){
            console.log("Error deleting transaction:", error.message);
            throw error;
          }
        }

        useEffect(()=>{
          setUser(JSON.parse(localStorage.getItem('user')));
          fetchTransactions();
        }, []);

       

        const states=useMemo(()=>{
          const now=new Date();
          const thirtyDaysAgo=new Date(now);
          thirtyDaysAgo.setDate(thirtyDaysAgo.getDate()-30);

          const last30DaysTransactions=transactions.filter((t)=>new Date(t.date)>=thirtyDaysAgo);
          const last30DaysIncome=last30DaysTransactions.filter((t)=>t.type==="income").reduce((sum,t)=>sum+Number(t.amount),0);
          

          const last30DaysExpense=last30DaysTransactions.filter((t)=>t.type==="expense").reduce((sum,t)=>sum+Number(t.amount),0);
          const allTimeIncome=transactions.filter((t)=>t.type==="income").reduce((sum,t)=>sum+Number(t.amount),0);
          const allTimeExpense=transactions.filter((t)=>t.type==="expense").reduce((sum,t)=>sum+Number(t.amount),0);
          
          const last30DaysSavings=last30DaysIncome-last30DaysExpense;
          const SavingsRate=last30DaysIncome>0?(last30DaysSavings/last30DaysIncome)*100:0;


          const last60daysAgo=new Date(now);
          last60daysAgo.setDate(last60daysAgo.getDate()-60);
         const previous30DaysTransactions=transactions.filter((t)=>new Date(t.date)>=last60daysAgo && new Date(t.date)<thirtyDaysAgo);
         
         const previous30DaysExpense=previous30DaysTransactions.filter((t)=>t.type==="expense").reduce((sum,t)=>sum+Number(t.amount),0);
         const expenseChange=previous30DaysExpense>0?((last30DaysExpense-previous30DaysExpense)/previous30DaysExpense)*100:0;
          return { totalTransactions: transactions.length, last30DaysIncome, last30DaysExpense, allTimeIncome, allTimeExpense,allTimeSavings: allTimeIncome - allTimeExpense, last30DaysSavings: last30DaysSavings, last30DaysSavingsRate: SavingsRate, expenseChange };
        }, [transactions]);

      const timeFrameLabel=useMemo(()=>{
        timeFrame==="daily"?"Today":timeFrame==="weekly"?"This Week":timeFrame==="yearly"?"This Year":timeFrame==="monthly"?"This Month"
        :"All";
      }, [timeFrame]);
      const filteredTransactions = (transactions, frame) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  switch (frame) {
    case "daily":
      return transactions.filter((t) => {
        const date = new Date(t.date);
        date.setHours(0, 0, 0, 0);
        return date.getTime() === today.getTime();
      });

    case "weekly":
      const startOfWeek = new Date(today);
      startOfWeek.setDate(today.getDate() - today.getDay());
        const endOfWeek = new Date(startOfWeek);
        endOfWeek.setDate(startOfWeek.getDate() + 6);
      return transactions.filter((t) => {
        const date = new Date(t.date);
        date.setHours(0, 0, 0, 0);
        return (date >= startOfWeek && date <= endOfWeek)  ;
      });

    case "monthly":
      const startOfMonth = new Date(today);
      startOfMonth.setDate(1);
      const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);
      
      return transactions.filter((t) => {
        const date = new Date(t.date);
        date.setHours(0, 0, 0, 0);
        return (date >= startOfMonth && date <= endOfMonth);
      });
      case "yearly":
  const startOfYear = new Date(today);
  startOfYear.setMonth(0); // January
  startOfYear.setDate(1);  // 1st
  const endOfYear = new Date(today.getFullYear() + 1, 0, 0);

  return transactions.filter((t) => {
    const date = new Date(t.date);
    date.setHours(0, 0, 0, 0);

    return (date >= startOfYear && date < endOfYear);
  });

    default:
      return transactions;
  }
};
      
      const outletContext={
         user:user,
        transactions:transactions,
        filteredTransactions:filteredTransactions,
        addTransaction:addTransaction,
        editTransaction:editTransaction,
        deleteTranscation:deleteTranscation,
        refreshTransactions:fetchTransactions,
        timeFrame:timeFrame,
        setTimeFrame:setTimeFrame,
        lastUpdated:lastUpdated,
      };
      const getSavingsRating=(rate)=>{
        
        return rate>30?"Excellent":rate>20?"Good":rate>10?"Average":"Poor";
      }

      const topCategories=useMemo(()=>
         Object.entries(
           transactions.filter((t)=>t.type==="expense").reduce((acc,t)=>{
            acc[t.category]=(acc[t.category]||0)+Number(t.amount);
            return acc;
           }, {})).sort((a,b)=>b[1]-a[1]).slice(0,5),[transactions]
         
      )

      const displayTransactions=showAllTransactions? transactions:transactions.slice(0,5);

    
    

  return (
    <div className="h-screen flex flex-col bg-gray-100">

      {/* Navbar */}
      
      <Navbar user={user} />

      {/* Body */}
      <div className="flex overflow-hidden">
        
        {/* Sidebar */}
        <div className="h-full">
          <Sidebar user={user} />
        </div>

        {/* Main Content */}
        <div className="flex-1 p-4 overflow-auto no-scrollbar">
          <Outlet context={{ states,getSavingsRating,outletContext }} />
           
        </div>
         {/* {Right} */}
        <div className="w-fit p-x-4 overflow-auto no-scrollbar mt-4 mb-4">
           <ExpenseDistribution value={{outletContext}} ></ExpenseDistribution>
           <SpendByCategory value={{outletContext}}></SpendByCategory>
        </div>
              
      </div>
    </div>
  );
}

export default Layout;

