import {validationResult} from 'express-validator';


export const validate=(req,res,next)=>{
    const errors=validationResult(req);
    if(errors.isEmpty()){
        return next();
    }
    const extractedErrors=[];
    errors.array().map((err)=>{
        extractedErrors.push({[err.path]:err.msg});
    })
    console.log("Validation errors:", extractedErrors);
    return res.status(422).json({
        message:'Validation Failed',
        errors:extractedErrors,
    });

}

