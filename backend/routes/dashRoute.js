const express = require('express');
const router = express.Router()
const verifyToken = require("../middleware/middleware")
const Product = require("../models/Product")
const Message = require("../models/Message")

router.get("/",verifyToken,async (req,res)=>
{
    try
    {
        const userId = req.user._id
        const products = await Product.find({sellerId:userId})
        if(products.length === 0)
        {
            return res.status(200).json({products:[]})
        }

        res.status(200).json({products})
    }
    catch(err)
    {
        res.status(400).json({message:err.message})
    }       
})

module.exports = router
    