import Expense from "../models/expenseModel.js";
import getDateRange from "../utils/dateRange.js";
import xlsx from 'xlsx';
export const addExpense=async(req,res)=>{
    const userId=req.user._id;
    const {description,amount,category,date}=req.body;
    try{
        const expense=await Expense.create({
            description,
            amount,
            category,
            date,
            userId,
        })
        res.status(201).json({
            message:'Expense added successfully',
            expense,
        })


    }catch(error){
        console.log("Error in adding expense:", error.message);
        res.status(500).json({message:error.message});
    }
}

export const getAllExpenses=async(req,res)=>{
    const userId=req.user._id;
    try{
        const expenses=await Expense.find({userId}).sort({date:-1});
        res.status(200).json({
            message:'Expenses fetched successfully',
            expenses,
        })
    }catch(error){
        console.log("Error in fetching expenses:", error.message);
        res.status(500).json({message:error.message});
    }
}

export const updateExpense=async(req,res)=>{
    const userId=req.user._id;
    const expenseId=req.params.id;
    const {description,amount,category,date}=req.body;
    try{
        const expense=Expense.findOne({_id:expenseId,userId});
        if(!expense){
            return res.status(404).json({message:'Expense not found'});
        }
        expense.description=description;
        expense.amount=amount;
        expense.category=category;
        expense.date=date;
        await expense.save();
        res.status(200).json({
            message:'Expense updated successfully',
            expense,
         });
    }catch(error){
        console.log("Error in updating expense:", error.message);
        res.status(500).json({message:error.message});

    }
}

export const deleteExpense=async(req,res)=>{
    const userId=req.user._id;
    const expenseId=req.params.id;
    try{
        const expense=await Expense.findOneAndDelete({_id:expenseId,userId});
        if(!expense){
            return res.status(404).json({message:'Expense not found'});
        }
        res.status(200).json({
            message:'Expense deleted successfully',
            expense,
        });
    }catch(error){
        console.log("Error in deleting expense:", error.message);
        res.status(500).json({message:error.message});
    }

}


export const getExpenseOverview=async(req,res)=>{
    const userId=req.user._id;
    try{
         const {range="monthly"}=req.query;
         const {start,end}=getDateRange(range);
            const expenses=await Expense.find({
                userId,
                date:{
                    $gte:start,$lte:end,
                },
            }).sort({date:-1});

            const totalExpense=expenses.reduce((total,expense)=>total+expense.amount,0);
            const averageExpense=expenses.length>0?totalExpense/expenses.length:0;
            const numberOfTransactions=expenses.length;

            const recentTransactions=expenses.slice(0,9);
            res.status(200).json({
                message:'Expense overview fetched successfully',
                totalExpense,
                averageExpense,
                numberOfTransactions,
                recentTransactions,
                range,
            });


}catch(error){     console.log("Error in fetching expense overview:", error.message);
     res.status(500).json({message:error.message});
    }
}

export const getExcelFile=async(req,res)=>{
    const userId=req.user._id;
    try{
        const expenses=await Expense.find({userId}).sort({date:-1});
        const plainData=expenses.map(expense=>({
            Description:expense.description,
            Amount:expense.amount,
            Category:expense.category,
            Date:expense.date.toISOString().split('T')[0],   
        }));
        const worksheet=xlsx.utils.json_to_sheet(plainData);
        const workbook=xlsx.utils.book_new();
        xlsx.utils.book_append_sheet(workbook,worksheet,'Expenses');
        const buffer=xlsx.writeFile(workbook,{type:'buffer',bookType:'xlsx'});
        res.setHeader('Content-Disposition','attachment; filename=expenses.xlsx');
        res.setHeader('Content-Type','application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.send(buffer);
    }catch(error){
        console.log("Error in exporting expense:", error.message);
        res.status(500).json({message:error.message});
    }

}

