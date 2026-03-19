import User from "../models/userModel.js";
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const createToken=(id)=>{
    return jwt.sign({id},process.env.TOKEN_SECRET,{expiresIn:'1d'});
}
export const registerUser=async(req,res)=>{
   try{
    const {name,email,password}=req.body;

    const user=await User.findOne({email});

    if(user){
        throw new Error('User already exists');
    }
    const hashed=await bcrypt.hash(password,10);
    const newUser=User.create({
        name,
        email,
        password:hashed,
    })
    const token=createToken(newUser._id);
    res.status(201).json({
        message:'User registered successfully',
        token,
        user:{
            id:newUser._id,
            name:newUser.name,
            email:newUser.email,
        }
    });



   } catch(error){
    console.log("Error in user registration:", error.message);
     res.status(500).json({message:error.message});
   }


    
}

export const loginUser=async(req,res)=>{
    try{
    const {email,password}=req.body;
        const user=await User.findOne({
            email,
        })
        if(!user){
            throw new Error('Invalid email or password');
        }
        const match=await bcrypt.compare(password,user.password);
        if(!match){
            throw new Error('Invalid email or password');
        }
        const token=createToken(user._id);
        res.status(200).json({
            message:'Login successful',
            token,
            user:{
                id:user._id,
                name:user.name,
                email:user.email,
            }
        });

}catch(error){
   console.log("Error in user logging:", error.message);
     res.status(500).json({message:error.message});
}
    
}

export const getUser=async(req,res)=>{
    try{
    const user=await User.findById(req.user.id).select('-password');
    if(!user){
        throw new Error('User not found');
    }
     res.status(200).json({
        message:'User fetched successfully',
        user,
     });
}catch(error){
         console.log("Error in fetching user:", error.message);
         res.status(500).json({message:error.message});
    }

}

export const updateUser=async(req,res)=>{
    try{
        const {name,email}=req.body;
        const exsists=await User.findOne({email,_id:{$ne:req.user.id}});
        if(exsists){
            throw new Error('Email already in use');
        }
        const user=await User.findByIdAndUpdate(req.user.id,{name,email},{new:true}).select('-password');
        if(!user){
            throw new Error('User not found');
        }
        res.status(200).json({
            message:'User updated successfully',
            user,
        });
    }catch(error){
        console.log("Error in updating user:", error.message);
        res.status(500).json({message:error.message});
    }
}

export const updatePassword=async(req,res)=>{
    try{
        const {currentPassword,newPassword}=req.body;
        const user=await User.findById(req.user.id);
        if(!user){
            throw new Error('User not found');
        }
        const match=await bcrypt.compare(currentPassword,user.password);
        if(!match){
            throw new Error('Current password is incorrect');
        }
        const hashed=await bcrypt.hash(newPassword,10);
        user.password=hashed;
        await user.save();
        res.status(200).json({
            message:'Password updated successfully',
        });
    }catch(error){
        console.log("Error in updating password:", error.message);
        res.status(500).json({message:error.message});
    }
}

