import React, { useState } from "react";
import { useOutletContext } from "react-router-dom";
import Axios from "axios";


function Add({outletContext,setOpen,open,type,id} ) {
    
   const [formData, setFormData] = useState({
          description: "",
          amount: "",
          category: "",
          date: "",
        });
      
        const [errors, setErrors] = useState({});
 
        const handleChange = (e) => {
     setFormData({ ...formData, [e.target.name]: e.target.value });
   };
   // Helper to change chart title based on tab context
    const validate = () => {
     let newErrors = {};
 
     if (!formData.description.trim()) {
       newErrors.description = "Description is required";
     }
 
     if (!formData.amount || Number(formData.amount) <= 0) {
       newErrors.amount = "Valid amount required";
     }
 
     if (!formData.category) {
       newErrors.category = "Category is required";
     }
 
     if (!formData.date) {
       newErrors.date = "Date is required";
     } else if (isNaN(new Date(formData.date).getTime())) {
       newErrors.date = "Invalid date";
     }
 
     setErrors(newErrors);
     return Object.keys(newErrors).length === 0;
   };
   const handleSubmit = () => {
     if (!validate()) return;
     if(type==="editIncome"){
      formData.type="income";
         outletContext.editTransaction(id,formData); 
         
        }
        else if(type==="editExpense"){
          formData.type="expense";
          outletContext.editTransaction(id,formData);
        }
     else{formData.type = type;
     outletContext.addTransaction(formData);
     console.log("Transaction added:", formData);}
 
     setOpen(false);
     setFormData({
       description: "",
       amount: "",
       category: "",
       date: "",
     });
     setErrors({});
   };
 
 
   return (
    <div>
    {open && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-xl w-[90%] max-w-md p-6">

            <h2 className="text-xl font-semibold mb-4 text-gray-700">
              {type === "expense" ? "Add Expense" :type==="editIncome"?"Edit Income":type==="editExpense"?"Edit Expense": "Add Income"}
            </h2>

            {/* Description */}
            <input
              type="text"
              name="description"
              placeholder="Description"
              value={formData.description}
              onChange={handleChange}
              className="w-full mb-1 p-2 border rounded-lg"
            />
            <p className="text-green-500 text-sm">{errors.description}</p>

            {/* Amount */}
            <input
              type="number"
              name="amount"
              placeholder="Amount"
              value={formData.amount}
              onChange={handleChange}
              className="w-full mt-2 mb-1 p-2 border rounded-lg"
            />
            <p className="text-green-500 text-sm">{errors.amount}</p>

            {/* Category */}
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full mt-2 mb-1 p-2 border rounded-lg"
            >
              <option value="">Select Category</option>
              <option value="Food">Food</option>
              <option value="Rent">Rent</option>
              <option value="Shopping">Shopping</option>
              <option value="Salary">Salary</option>
              <option value="Other">Other</option>
            </select>
            <p className="text-green-500 text-sm">{errors.category}</p>

            {/* Date */}
            <input
              type="date"
              name="date"
              value={formData.date}
              placeholder="YYYY-MM-DD (e.g, 2023-08-15)"
              onChange={handleChange}
              className="w-full mt-2 mb-1 p-2 border rounded-lg"
            />
            <p className="text-green-500 text-sm">{errors.date}</p>

            {/* Actions */}
            <div className="flex justify-end gap-3 mt-4">
              <button
                onClick={() => setOpen(false)}
                className="px-4 py-2 rounded-lg border"
              >
                Cancel
              </button>

              <button
                onClick={handleSubmit}
                className="px-4 py-2 rounded-lg bg-green-500 text-white hover:bg-green-600"
              >
                Save
              </button>
            </div>

          </div>
        </div>
      )
    
    }
    </div>

    )
    
    
    };

    export default Add;