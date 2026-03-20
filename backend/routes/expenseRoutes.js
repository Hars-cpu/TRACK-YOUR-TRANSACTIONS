import { Router } from "express";
import { validate } from "../middlewares/validatorMiddleware.js";
import { validateExpenseAdd,validateExpenseUpdate } from "../validators/expenseValidators.js";
import { addExpense,updateExpense,deleteExpense,getAllExpenses,getExpenseOverview,getExcelFile } from "../controllers/expenseControllers.js";
import { authMiddleware } from "../middlewares/auth.js";

const expenseRouter=Router();

expenseRouter.post('/add',validateExpenseAdd,validate,authMiddleware,addExpense);
expenseRouter.get('/all',authMiddleware,getAllExpenses);
expenseRouter.put('/update/:id',validateExpenseUpdate,validate,authMiddleware,updateExpense);
expenseRouter.delete('/delete/:id',authMiddleware,deleteExpense);
expenseRouter.get('/overview',authMiddleware,getExpenseOverview);
expenseRouter.get('/export',authMiddleware,getExcelFile);


export default expenseRouter;

