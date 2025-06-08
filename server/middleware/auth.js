//it is the function which is executed before the controller function using this middleware we will protect the route so if the user is authenticated then only they will reach api end point

import User from "../Models/User";
import jwt from "jsonwebtoken";

//Middleware to protect route


export const protectRoute=async(req,res,next)=>{
    try{

        const token=req.headers.token;
        const decoded=jwt.verify(token,process.env.JWT_SECRET);
        
        const user=await User.findById(decoded.userId).select("-password");
        if(!user)
            return res.json({success:false,message:"User not found"});


        req.user=user;
        next();
    }
    catch(error)
    {
        console.log(error.message);
res.json({success:false,message:error.message})
    }

}


