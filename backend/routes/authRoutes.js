const express = require("express")
const router = express.Router()
const User = require("../models/User")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken");

router.post("/register",async (req,res)=>
{
    try
    {
        const {name,email,phone,password,city} = req.body
        if(!name || !email || !phone || !password || !city)
        {
            return res.status(400).json({message:"All fields Required"})
        }
        const existingUser = await User.findOne({email})
        if(existingUser)
        {
            return res.status(400).json({message:"Account already registered"})
        }
        const salt  = await bcrypt.genSalt(10)
        const hashedPassword =  await bcrypt.hash(password,salt)
        
        const newUser = new User({
            name,email,phone,password:hashedPassword,city
        })
        await newUser.save()
        return res.status(201).json({message:"User Registered Succesfully"})
    }
    catch(err)
    {
        return res.status(400).json({message:err.message})
    }
})


router.post("/login",async (req,res)=>
{
    try
    {
        const { identifier, password } = req.body
        if(!identifier || !password)
        {
            return res.status(400).json({message:"All fields Required"})
        }

        const searchValue = identifier.trim()
        const user = await User.findOne({
            $or: [
                { email: searchValue },
                { name: searchValue }
            ]
        })

        if(!user)
        {
            return res.status(400).json({message:"Invalid Credentials"})
        }
        const isMatch = await bcrypt.compare(password,user.password)
        if(!isMatch)
        {
            return res.status(400).json({message:"Invalid Credentials"})
        }
        const token = jwt.sign({_id:user._id},process.env.JWT_SECRET,{expiresIn:"2h"})
        res.json({token,user:{
        _id:user._id,
        name:user.name,
        email:user.email
    }})
    
    }
    catch(err)
    {
        return res.status(400).json({message:err.message})
    }

})

module.exports = router