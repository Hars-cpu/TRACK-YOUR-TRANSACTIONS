import Income from "../models/incomeModel.js";
import getDateRange from "../utils/dateRange.js";
import xlsx from 'xlsx';

function normalizeWord(word){
    if(!word)return "OTHERS";
    return word.replace(/[\s-]+/g,'').toUpperCase();
}
export const addIncome=async(req,res)=>{
    const userId=req.user._id;
    const {description,amount,category,date}=req.body;
    try{
        const income=await Income.create({
            description,
            amount,
            category: normalizeWord(category),
            date,
            userId,
        })
        res.status(201).json({
            message:'Income added successfully',
            income,
        })


    }catch(error){
        console.log("Error in adding income:", error.message);
        res.status(500).json({message:error.message});
    }
}

export const getAllIncome=async(req,res)=>{
    const userId=req.user._id;
    try{
        const incomes=await Income.find({userId}).sort({date:-1});
        res.status(200).json({
            message:'Incomes fetched successfully',
            incomes,
        })
    }catch(error){
        console.log("Error in fetching incomes:", error.message);
        res.status(500).json({message:error.message});
    }
}

export const updateIncome=async(req,res)=>{
    const userId=req.user._id;
    const incomeId=req.params.id;
    const {description,amount,category,date}=req.body;
    try{
        const income=await Income.findOneAndUpdate({_id:incomeId,userId},{$set:{description,amount,category:normalizeWord(category),date}},{new:true});
        if(!income){
            return res.status(404).json({message:'Income not found'});
        }
        res.status(200).json({
            message:'Income updated successfully',
            income,
        });
    }catch(error){
        console.log("Error in updating income:", error.message);
        res.status(500).json({message:error.message});
    }
}



export const deleteIncome=async(req,res)=>{
    const userId=req.user._id;
    const incomeId=req.params.id;
    try{
        const income=await Income.findOneAndDelete({_id:incomeId,userId});
        if(!income){
            return res.status(404).json({message:'Income not found'});
        }
        res.status(200).json({
            message:'Income deleted successfully',
            income,
        });
    }catch(error){
        console.log("Error in deleting income:", error.message);
        res.status(500).json({message:error.message});
    }

}


export const getIncomeOverview=async(req,res)=>{
    const userId=req.user._id;
    try{
         const {range="monthly"}=
         req.range;
         const {start,end}=getDateRange(range);
            const incomes=await Income.find({
                userId,
                date:{
                    $gte:start,$lte:end,
                },
            }).sort({date:-1});

            const totalIncome=incomes.reduce((total,income)=>total+income.amount,0);
            const averageIncome=incomes.length>0?totalIncome/incomes.length:0;
            const numberOfTransactions=incomes.length;
            
            const recentTransactions=incomes.slice(0,9);
            res.status(200).json({
                message:'Income overview fetched successfully',
                income:incomes,
                totalIncome,
                averageIncome,
                numberOfTransactions,
                recentTransactions,
                range,
            });


}catch(error){     console.log("Error in fetching income overview:", error.message);
     res.status(500).json({message:error.message});
    }
}

export const getExcelFile=async(req,res)=>{
    const userId=req.user._id;
    try{
        const {range="monthly"}=
         req.range;
         const {start,end}=getDateRange(range);
            const incomes=await Income.find({
                userId,
                date:{
                    $gte:start,$lte:end,
                },
            }).sort({date:-1});
        const plainData=incomes.map(income=>({
            Description:income.description,
            Amount:income.amount,
            Category:income.category,
            Date:income.date.toISOString().split('T')[0],   
        }));
        
        const worksheet=xlsx.utils.json_to_sheet(plainData);
        const workbook=xlsx.utils.book_new();
        xlsx.utils.book_append_sheet(workbook,worksheet,'Incomes');
        const buffer=xlsx.write(workbook,{type:'buffer',bookType:'xlsx'});
        res.setHeader('Content-Disposition','attachment; filename=incomes.xlsx');
        res.setHeader('Content-Type','application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.send(buffer);
        
    }catch(error){
        console.log("Error in exporting income:", error.message);
        res.status(500).json({message:error.message});
    }
         
}

