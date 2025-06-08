import { generateToken } from "../lib/utils";
import User from "../Models/User";
import bcrypt from "bcryptjs";
import cloudinary  from "../lib/cloudinary.js";
 


 export const signup= async (req,res)=>{
    const {fullName,email,password,bio}=req.body;


    try{
        if(!fullName || !email || !password || !bio)
            return res.json({success:false,message:"Missing credentials"})

        const user=await User.findOne({email});
        if(user)
            return res.json({success:false,message:"User alredy exists"});
        const salt=await bcrypt.genSalt(10)
        const hashedPassword=await bcrypt.hash(password,salt);

        const newUser=await User.create({
            fullName,email,password:hashedPassword,bio
        });

        const token=generateToken(newUser._id);
res.json({success:true,userData:newUser,token,message:"Account created successfully"})
    }
    catch(error){
        console.log(error.message)
        res.json({success:false,message:error.message})
    }
 }

export const login=async(req,res)=>{
    try{
    const {email,password}=req.body;
    if(!email || !password)
         return res.json({success:false,message:"Missing credentials"});
    const userData=await User.findOne({email});

    const isPasswordCorrect =await bcrypt.compare(password,userData.password);

if(!isPasswordCorrect)
    return res.json({success:false,messsage:"Invalid Credentials"});

const token=generateToken(newUser._id);
res.json({success:true,userData,token,message:"Login successful"})
    }
    catch(error)
    {
 console.log(error.message)
        res.json({success:false,message:error.message})
    }
}
//controller to check if user is authenticated

export const checkAuth=(req,res)=>{
    res.json({success:true,user:req.user})
}

//controller to update user profile details

export const updateProfile=async(req,res)=>{
    try{
        const {profilePic,bio,fullName}=req.body;
        const userId=req.user._id;
        let updatedUser;
        if(!profilePic)
        {
            await User.findByIdAndUpdate(userId,{bio,fullName},{new:true});

        }

        else{
            const upload=await cloudinary.uploader.upload(profilePic);

            updatedUser=await User.findByIdAndUpdate(userId,{profilePic:upload.secure_url,bio,fullName},{new:true});

        }
        res.json({success:true,user:updatedUser});
    }
    catch(error)
    {
        console.log(error.message);
res.json({success:false,message:error.message});
    }
}