import incomeModel from "../models/incomeModel.js";
import expenseModel from "../models/expenseModel.js";


export const getDashboardData=async(req,res)=>{
    const userId=req.user._id;
    const now=new Date();
    const startOfMonth=new Date(now.getFullYear(),now.getMonth(),1);
    try{
        const incomes=await incomeModel.find({
            userId,
            date:{$gte:startOfMonth,$lte:now},
        });
        const expenses=await expenseModel.find({
            userId,
            date:{$gte:startOfMonth,$lte:now},
        });

         const monthlyIncome=incomes.reduce((total,income)=>{
            total+=Number(income.amount);
            return total;
         },0);
            const monthlyExpense=expenses.reduce((total,expense)=>{
                total+=Number(expense.amount);
                return total;
            },0);
            const savings=monthlyIncome-monthlyExpense;
            const savingsPercentage=monthlyIncome>0?(savings/monthlyIncome)*100:0;

            const recentTranscations=[
                ...incomes.map(income=>({...income,type:'income'})),
                ...expenses.map(expense=>({...expense,type:'expense'})),
            ].sort((a,b)=>b.date-a.date);

            const spendByCategory={};
            for(const expense of expenses){
               
                if(spendByCategory[expense.category||"OTHERS"]){
                    spendByCategory[expense.category||"OTHERS"]+=Number(expense.amount||0);
                }else{
                    spendByCategory[expense.category||"OTHERS"]=Number(expense.amount||0);
                }
            }

            const expenseDistribution=Object.entries(spendByCategory).map(([category,amount])=>({
                category,
                amount,
                percent: monthlyExpense>0?(amount/monthlyExpense)*100:0,
            }));

            return res.status(200).json({
                data:{
                    monthlyIncome,
                    monthlyExpense,
                    savings,
                    savingsPercentage,
                    recentTranscations,
                    spendByCategory,
                    expenseDistribution,
                }
            })


    } catch (error) {
        console.error("Error fetching dashboard data:", error.message);
        res.status(500).json({ message: error.message });
    }

}