const mongoose = require('mongoose');

const express = require("express");

const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:
    {
        type:String,
        required:true
    },
    phone:
    {
        type:Number,
        required:true
    },
    password:
    {
        type:String,
        required:true
    },
    city:
    {
        type:String,
        required:true
    },
    ratings:
    {
        type:Number
    },
    reports:
    {
        type:Number
    },
    account_status:
    {
        type:String
    },
    createdAt:{type:Date,default:Date.now}


})

module.exports = mongoose.model("User",userSchema);