import React, { useState, useEffect } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { 
  TrendingUp, 
  Filter, 
  Plus, 
  DollarSign, 
  BarChart2, 
  Calendar,
  Activity,
  Download,
  FileText,
  Edit2,
  Trash2 
} from 'lucide-react';
import { useOutletContext } from 'react-router-dom';
import Add from './add';
import axios from 'axios';
import { backendUrl } from '../main';

export default function ExpenseDashboard() {
  const [activeTab, setActiveTab] = useState('Yearly');
  const tabs = ['Daily', 'Weekly', 'Monthly', 'Yearly'];
  const [open, setOpen] = useState(false);
  const { outletContext } = useOutletContext();
  const [data, setData] = useState();
  const [transactionsList, setTransactionsList] = useState([]);
  const [type, setType] = useState('');
  const [id, setId] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState({
    totalExpense: 0,
    averageExpense: 0,
    numberOfTransactions: 0,
  });
  
  // --- Axios Data Fetching Hook ---
  useEffect(() => {
    const fetchExpenseData = async () => {
      try {
        setIsLoading(true);
        const rangeParam = activeTab.toLowerCase();
        const token = localStorage.getItem('token');
        const headers = token ? { Authorization: `Bearer ${token}` } : {};
        
        const response = await axios.get(`${backendUrl}/api/expense/overview?range=${rangeParam}`, {
          headers: headers,
        });
      
        if (response.data) {
          setDashboardData({
            totalExpense: response.data.totalExpense || 0,
            averageExpense: response.data.averageExpense || 0,
            numberOfTransactions: response.data.numberOfTransactions || 0,
          });
        }

        const expenses = response?.data?.expense || response?.data?.expenses || [];
        setTransactionsList(expenses);

        const grouped = {};
        const now = new Date();

        // ================= WEEKLY =================
        if (activeTab === "Weekly") {
          const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

          days.forEach((d) => {
            grouped[d] = { expense: 0 };
          });
                  
          expenses.forEach((t) => {
            const date = new Date(t.date);
            const day = date.toLocaleString("default", { weekday: "short" });
            grouped[day].expense += Number(t.amount);
          });

          setData(days.map((d) => ({ name: d, ...grouped[d] })));
        }
        
        // ================= YEARLY =================
        else if (activeTab === "Yearly") {
          const months = [
            "Jan","Feb","Mar","Apr","May","Jun",
            "Jul","Aug","Sep","Oct","Nov","Dec"
          ];

          months.forEach((m) => {
            grouped[m] = { expense: 0 };
          });

          expenses.forEach((t) => {
            const month = new Date(t.date).toLocaleString("default", { month: "short" });
            grouped[month].expense += Number(t.amount);
          });

          setData(months.map((m) => ({ name: m, ...grouped[m] })));
        }

        // ================= MONTHLY =================
        else if (activeTab === "Monthly") {
          const days = [];

          for (let i = 1; i <= 31; i++) {
            days.push(i);
          }

          days.forEach((d) => {
            grouped[d] = { expense: 0 };
          });

          expenses.forEach((t) => {
            const date = new Date(t.date);
            const day = date.getDate();
            grouped[day].expense += Number(t.amount);
          });

          setData(days.map((d) => ({ name: d, ...grouped[d] })));
        }

        // ================= DAILY =================
        else if (activeTab === "Daily") {
          const hours = [];

          for (let i = 0; i < 24; i++) {
            const label = new Date(0, 0, 0, i).toLocaleString("default", { hour: "numeric" });
            hours.push(label);
            grouped[label] = { expense: 0 };
          }

          expenses.forEach((t) => {
            const date = new Date(t.date);
            const hour = date.toLocaleString("default", { hour: "numeric" });
            grouped[hour].expense += Number(t.amount);
          });

          setData(hours.map((h) => ({ name: h, ...grouped[h] })));
        }
      } catch (error) {
        console.error("Error fetching expense overview:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchExpenseData();
  }, [activeTab, outletContext.transactions]);
 
  const getChartTitle = () => {
    switch (activeTab) {
      case 'Yearly': return 'Monthly Expense Trends';
      case 'Monthly': return 'Daily Expense Trends';
      case 'Weekly': return 'Daily Expense Trends';
      case 'Daily': return 'Hourly Expense Trends';
      default: return 'Expense Trends';
    }
  };

  const getSubLabel = () => {
    switch (activeTab) {
      case 'Yearly': return 'This Year';
      case 'Monthly': return 'This Month';
      case 'Weekly': return 'This Week';
      case 'Daily': return 'Today';
      default: return '';
    }
  };

  const exporting = async () => {
    try {
      const token = localStorage.getItem('token');
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      const rangeParam = activeTab.toLowerCase();
      
      const res = await axios.get(`${backendUrl}/api/expense/export?range=${rangeParam}`, {
        headers: headers,
        responseType: 'blob'
      });
      
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const a = document.createElement("a");
      a.href = url;
      a.download = "expenses.xlsx";
      document.body.appendChild(a);
      a.click();
      a.remove();

      window.URL.revokeObjectURL(url);
    } catch(error) {
      console.log(error);
    }
  }

  const removeTransaction = async (id) => {
    try {
      // Adjusted the delete parameter based on conventional structure assuming context expects "expense"
      outletContext.deleteTranscation(id, "expense");
      console.log("successfully deleted");
    } catch(error) {
      console.log("Error deleting transaction:", error.message);
    }
  }

  return (
    <div className="w-full min-h-screen bg-[#f8fafc] p-4 md:p-8 font-sans">
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* --- HEADER SECTION --- */}
        <div className="bg-white rounded-3xl p-8 shadow-[0_2px_20px_rgba(0,0,0,0.02)] border border-gray-100">
          <div className="flex justify-between items-center mb-8 pb-4 border-b border-gray-50">
            <div className="flex items-center space-x-3 cursor-pointer group">
              <div className="p-1.5 bg-red-50 rounded-lg group-hover:bg-red-100 transition-colors">
                <TrendingUp className="w-4 h-4 text-red-600" />
              </div>
              <span className="font-semibold text-gray-800 text-sm tracking-wide">Financial Overview</span>
              <span className="text-gray-400 font-medium text-sm">({getSubLabel()})</span>
            </div>
            
            <button className="flex items-center space-x-1.5 text-gray-400 hover:text-gray-800 transition-colors group">
              <Filter className="w-4 h-4 group-hover:rotate-12 transition-transform" />
              <span className="font-medium text-sm">Filters</span>
            </button>
          </div>

          <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-8">
            <div className="space-y-1.5 pt-1">
              <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">Expense Overview</h1>
              <p className="text-gray-400 font-medium text-sm pt-1">Track and manage your expenses</p>
            </div>

            <div className="flex flex-col sm:items-end gap-5">
              <button onClick={() => { setType("expense"); setOpen(true); }} className="group flex flex-none items-center justify-center space-x-2 px-6 py-2.5 bg-red-600 hover:bg-red-700 active:bg-red-800 text-white rounded-xl font-semibold transition-all duration-300 shadow-[0_4px_14px_0_rgba(220,38,38,0.39)] hover:shadow-[0_6px_20px_rgba(220,38,38,0.23)] hover:-translate-y-0.5">
                <Plus className="w-5 h-5 transition-transform group-hover:rotate-90" />
                <span>Add Expense</span>
              </button>

              <div className="flex items-center p-1 space-x-1 bg-white border border-gray-100 shadow-sm rounded-lg">
                {tabs.map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-4 py-1.5 rounded-md text-sm font-semibold transition-all duration-200 ${
                      activeTab === tab
                        ? 'bg-red-500 text-white shadow-sm'
                        : 'text-gray-400 hover:text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* --- METRIC CARDS SECTION --- */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-3xl p-6 shadow-[0_2px_20px_rgba(0,0,0,0.02)] border border-gray-100 hover:border-red-100 transition-colors">
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-2 bg-red-50 rounded-xl text-red-600">
                <DollarSign className="w-5 h-5" />
              </div>
              <span className="text-gray-500 font-semibold text-sm">Total Expense</span>
            </div>
            <div className="text-3xl font-extrabold text-gray-900 mb-2">{dashboardData.totalExpense.toLocaleString("en-IN",{style:"currency",currency:"INR"})}</div>
            <div className="flex items-center text-xs text-gray-400 font-medium space-x-1.5">
              <Calendar className="w-3.5 h-3.5" />
              <span>{getSubLabel()}</span>
            </div>
          </div>

          <div className="bg-white rounded-3xl p-6 shadow-[0_2px_20px_rgba(0,0,0,0.02)] border border-gray-100 hover:border-blue-100 transition-colors">
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-2 bg-blue-50 rounded-xl text-blue-600">
                <BarChart2 className="w-5 h-5" />
              </div>
              <span className="text-gray-500 font-semibold text-sm">Average Expense</span>
            </div>
            <div className="text-3xl font-extrabold text-gray-900 mb-2">{dashboardData.averageExpense.toLocaleString("en-IN",{style:"currency",currency:"INR"})}</div>
            <div className="flex items-center text-xs text-gray-400 font-medium space-x-1.5">
              <Calendar className="w-3.5 h-3.5" />
              <span>{dashboardData.numberOfTransactions} transactions</span>
            </div>
          </div>

          <div className="bg-white rounded-3xl p-6 shadow-[0_2px_20px_rgba(0,0,0,0.02)] border border-gray-100 hover:border-purple-100 transition-colors">
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-2 bg-purple-50 rounded-xl text-purple-600">
                <Activity className="w-5 h-5" />
              </div>
              <span className="text-gray-500 font-semibold text-sm">Transactions</span>
            </div>
            <div className="text-3xl font-extrabold text-gray-900 mb-2">{dashboardData.numberOfTransactions}</div>
            <div className="flex items-center text-xs text-gray-400 font-medium space-x-1.5">
              <Calendar className="w-3.5 h-3.5" />
              <span>All records</span>
            </div>
          </div>
        </div>

        {/* --- AREA CHART SECTION --- */}
        <div className="bg-white rounded-3xl p-8 shadow-[0_2px_20px_rgba(0,0,0,0.02)] border border-gray-100">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
            <div className="flex items-center space-x-2">
              <BarChart2 className="w-5 h-5 text-red-500" />
              <h2 className="text-xl font-bold text-gray-900">{getChartTitle()}</h2>
              <span className="text-sm font-medium text-gray-400">({getSubLabel()})</span>
            </div>
            
            <button onClick={() => exporting()} className="flex items-center space-x-1.5 px-4 py-2 border border-gray-200 text-gray-600 rounded-lg hover:bg-gray-50 transition-colors text-sm font-semibold max-w-max">
              <Download className="w-4 h-4" />
              <span>Export Data</span>
            </button>
          </div>

          <div className="w-full h-[320px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart 
                data={data} 
                margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="4 4" vertical={false} stroke="#f3f4f6" />
                <XAxis 
                  dataKey="name" 
                  axisLine={{ stroke: '#f3f4f6', strokeWidth: 2 }} 
                  tickLine={false} 
                  tick={{ fill: '#9ca3af', fontSize: 13, fontWeight: 500 }}
                  dy={10}
                  interval={0}
                  minTickGap={100}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#b91c1c', fontSize: 13, fontWeight: 500 }}
                  tickFormatter={(value) => `₹${value}`}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#fff', 
                    borderRadius: '16px', 
                    border: '1px solid #f3f4f6', 
                    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.05)' 
                  }}
                  itemStyle={{ color: '#b91c1c', fontWeight: 700 }}
                  labelStyle={{ color: '#6b7280', fontWeight: 600, marginBottom: '4px' }}
                  formatter={(value) => [`₹${value}`, 'Expense']}
                  cursor={{ stroke: '#ef4444', strokeWidth: 1, strokeDasharray: '4 4' }}
                />
                <Area 
                  type="monotone" 
                  dataKey="expense" 
                  stroke="#ef4444" 
                  strokeWidth={3} 
                  fillOpacity={1} 
                  fill="url(#colorAmount)"
                  activeDot={{ r: 6, fill: '#ef4444', stroke: '#fff', strokeWidth: 3 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

        </div>

      </div>
      <Add outletContext={outletContext} setOpen={setOpen} open={open} type={type} id={id} />
      
        <div className="bg-white rounded-3xl p-8 shadow-[0_2px_20px_rgba(0,0,0,0.02)] border border-gray-100 mt-4">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
            <div className="flex items-center space-x-2">
              <DollarSign className="w-6 h-6 text-red-500 font-bold" />
              <h2 className="text-xl font-bold text-gray-900">Expense Transactions</h2>
              <span className="text-sm font-medium text-gray-400">({getSubLabel()})</span>
            </div>
            
            <div className="flex items-center space-x-3">
              <button className="flex items-center space-x-1.5 px-4 py-2 border border-gray-200 text-gray-600 rounded-lg hover:bg-gray-50 transition-colors text-sm font-semibold">
                <span>All Transactions</span>
                <Filter className="w-4 h-4 ml-1" />
              </button>
              <button onClick={() => exporting()} className="flex items-center space-x-1.5 px-4 py-2 border border-gray-200 text-gray-600 rounded-lg hover:bg-gray-50 transition-colors text-sm font-semibold">
                <Download className="w-4 h-4" />
                <span>Export</span>
              </button>
            </div>
          </div>
          <div className="space-y-1 mt-4">
            {transactionsList.map((tx) => (
              <div key={tx._id} className="flex items-center justify-between py-4 border-b border-gray-50 last:border-b-0 hover:bg-gray-50/50 transition-colors rounded-2xl px-3 -mx-3 group">
                
                {/* Left side: Icon + Texts */}
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-red-50 rounded-xl text-red-600 group-hover:bg-red-100 transition">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-gray-900 font-bold text-[15px] tracking-tight">{tx.description || 'Expense'}</h3>
                    <p className="text-gray-400 font-medium text-[13px] mt-0.5">
                      {new Date(tx.date).toLocaleDateString(undefined, { month: 'numeric', day: 'numeric', year: 'numeric'})} • {tx.category || 'Uncategorized'}
                    </p>
                  </div>
                </div>
                
                {/* Right side: Amount + Actions */}
                <div className="flex items-center space-x-6">
                  {/* Shows as a negative or red expense amount */}
                  <span className="font-bold text-red-600 tracking-tight">
                    -₹{Number(tx.amount || 0).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </span>
                  
                  {/* Action Icons (Edit / Delete) */}
                  <div className="flex items-center space-x-2 text-red-500/70 opacity-0 group-hover:opacity-100 transition-all duration-200">
                    <button onClick={()=>{
                       setType('editExpense');
                       setOpen(true);
                       setId(tx._id);
                    }} className="hover:text-red-700 hover:bg-red-50 p-1.5 rounded-lg transition-colors">
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button onClick={()=>{
                        removeTransaction(tx._id);
                    }} className="hover:text-red-600 hover:bg-red-100 p-1.5 rounded-lg transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
            
            {/* Empty State */}
            {transactionsList.length === 0 && (
               <div className="py-10 text-center text-gray-400 text-sm font-medium">
                 No transactions found.
               </div>
            )}
          </div>
        </div>
      
    </div>
  );
}
