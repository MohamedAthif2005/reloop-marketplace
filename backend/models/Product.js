const express = require('express');
const mongoose = require("mongoose")

const  productSchema = new mongoose.Schema({
    title:{type:String,required:true},
    description:{type:String,required:true},
    price:{type:Number,required:true},
    category:{type:String,required:true},
    condition:{type:String,required:true},
    images:{type:[String],required:true},
    sellerId:{type:mongoose.Schema.Types.ObjectId,ref:"User"},
    location:{type:String},
    status:{type:String,default:"Available"},
    createdAt:{type:Date,default:Date.now}
})

module.exports = mongoose.model("Product",productSchema);