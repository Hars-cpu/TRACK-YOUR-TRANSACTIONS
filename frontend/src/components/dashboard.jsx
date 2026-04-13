import React from 'react'
import Dashbar from './dashbar'
import RecentTransactions from './recentTransactions'
import { useOutletContext } from "react-router-dom";
import GraphicalRepresentation from './graphicalRepresentation.jsx';
import AddingTransactions from './addingTransactions.jsx';

function Dashboard() {
    const { states, getSavingsRating ,outletContext} = useOutletContext();
     
  return (
    <div className='bg-white rounded-3xl p-4'>
         {/* Header */}
        <h1 className="text-2xl font-extrabold text-gray-900 mb-6 tracking-tight">
          Dashboard
        </h1>
        <div className="flex flex-col gap-10 bg-white rounded-3xl  p-6">
               <Dashbar value={{states, getSavingsRating,outletContext}}></Dashbar>
               <AddingTransactions value={{outletContext}}></AddingTransactions>
               <GraphicalRepresentation value={outletContext}></GraphicalRepresentation>
            <RecentTransactions value={outletContext}></RecentTransactions>
            
        </div>
           

    </div>
  )
}

export default Dashboard;