const User = require("../models/User");
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
// register controllera
const registerUser = async(req,res)=>{
    try{
        // extract user information from request body
        const {username,email,password,role } = req.body;
        // check if user already exists in our database
        const checkExistinguser = await User.findOne({$or:[{username}, {email}]});
        if(checkExistinguser){
            return res.status(400).json({success: false, message: "User already exists"});
        }
    // hash the password
    const salt  = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password,salt);
    // create a new user and save in your database
    const newlyCreatedUser = await User.create({
        username, 
        email, 
        password: hashedPassword, 
        role: role || 'user' // default role is 'user'
    });
    await newlyCreatedUser.save();
    if(newlyCreatedUser){
        return res.status(201).json({success: true, message: "User registered successfully"}); }

    
    else{
        return res.status(400).json({success: false, message: "User registration failed"});
    }
    
}
    catch(err){
        console.log(err);
        res.status(500).json({success: false, message: "Please try again"});
    }
}


//login controller
const loginUser = async(req,res)=>{
    try{

        // extract user information from request body
        const {username, password} = req.body;
        // check if user exists in our database
        const user = await User.findOne({username});
        if(!user){
            return res.status(400).json({success: false, message: "User does not exist"});
        }
        
        // compare the password with the hashed password in the database
        const isPasswordCorrect = await bcrypt.compare(password,user.password);
        if(!isPasswordCorrect){
            return res.status(400).json({success: false, message: "Invalid credentials"});
        }
        
        const accessToken = jwt.sign({
            userId: user._id,
            username: user.username,
            role: user.role
        },process.env.JWT_SECRET_KEY,{expiresIn: '15m'});
        // if everything is correct, send success response
        return res.status(200).json({success: true, message: "Login successful", accessToken, user});
    }
    catch(err){
        console.log(err);
        res.status(500).json({success: false, message: "Please try again"});
    }
};

const changePassword = async(req,res)=>{
    try{
        const userId = req.userInfo.userId;
        // extract old password and new password from request body
        const {oldPassword, newPassword} = req.body;
        const user = await User.findById(userId);
        if(!user){
            return res.status(400).json({success: false, message: "User does not exist"});
        }
        // check the old password is correct 
        const isPasswordMatch = await bcrypt.compare(oldPassword,user.password);
        if(!isPasswordMatch){
            return res.status(400).json({success: false, message: "Old password is incorrect"});    
        }
        // hash the new password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword,salt);
        // update the password in the database
        user.password = hashedPassword;
        await user.save();
        return res.status(200).json({success: true, message: "Password changed successfully"});


        }



    
    catch(e){
        console.log(e);
        res.status(500).json({success: false, message: "Please try again"});
    }
}

module.exports = {loginUser,registerUser,changePassword};