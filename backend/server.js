import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import { connectDB } from './config/db.js';
import userRouter from './routes/userRoutes.js';
import incomeRouter from './routes/incomeRoutes.js';
import expenseRouter from './routes/expenseRoutes.js';
const app=express()
const port=4000

const corsOptions={
    origin:'*',

    
}

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({extended:true}));




 await connectDB();
 app.use('/api/user',userRouter);
 app.use('/api/income',incomeRouter);
 app.use('/api/expense',expenseRouter);

app.get('/',(req,res)=>{
    res.send("Working");
})


app.listen(port,()=>{
    console.log(`server running on http://localhost:${port}`);
})

