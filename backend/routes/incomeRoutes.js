import { Router } from "express";
import { validate } from "../middlewares/validatorMiddleware.js";
import { validateIncomeAdd,validateIncomeUpdate } from "../validators/incomevalidators.js";
import { addIncome,updateIncome,deleteIncome,getAllIncome,getIncomeOverview,getExcelFile } from "../controllers/incomeControllers.js";
import { authMiddleware } from "../middlewares/auth.js";

const incomeRouter=Router();

incomeRouter.post('/add',validateIncomeAdd,validate,authMiddleware,addIncome);
incomeRouter.get('/all',authMiddleware,getAllIncome);
incomeRouter.put('/update/:id',validateIncomeUpdate,validate,authMiddleware,updateIncome);
incomeRouter.delete('/delete/:id',authMiddleware,deleteIncome);
incomeRouter.get('/overview',authMiddleware,getIncomeOverview);
incomeRouter.get('/export',authMiddleware,getExcelFile);


export default incomeRouter;

