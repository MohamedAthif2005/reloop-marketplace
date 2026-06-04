const express = require('express');
const router = express.Router();
const Product = require("../models/Product")
const Message = require("../models/Message")
const verifyToken = require("../middleware/middleware")
const multer = require('multer')
const fs = require('fs')
const path = require('path')

// ensure uploads directory exists
const uploadDir = path.join(__dirname, '..', 'uploads')
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir)

const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, uploadDir),
    filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname.replace(/\s+/g, '_'))
})

const upload = multer({
    storage,
    fileFilter: (req, file, cb) => {
        if (file.mimetype && file.mimetype.startsWith('image/')) cb(null, true)
        else cb(new Error('Only image files are allowed'))
    }
})



router.get("/allproducts", async (req, res) => {
    console.log(req.user)
    try {
        const products = await Product.find({})
        res.json(products)
    } catch (err) {
        console.error(err)
        res.status(500).json({message: "Server error"})
    }
})
router.get("/search/:title", async (req, res) => {
    try {
        const products = await Product.find({title: {$regex: req.params.title, $options: "i"}})
        res.json(products)
    }   
    catch (err) {
        console.error(err)
        res.status(500).json({message: "Server error"})
    }
})
router.get("/viewproduct/:id",verifyToken, async (req, res) => {
    try {
        const productId = req.params.id
        const product = await Product.findById(productId)

        if (!product) {
            return res.status(404).json({message: "Product not found"})
        }
        const isSeller = product.sellerId.toString() === req.user._id.toString()
        res.json({product,isSeller})
    } catch (err) {
        console.error(err)
        res.status(500).json({message: "Server error"})
    }
})

router.get("/filter",async(req,res)=>
{
    try{
        const query = {}
        if(req.query.category){
            query.category = req.query.category
        }
        if(req.query.condition){
            query.condition = req.query.condition
        }
        if(req.query.location){
            query.location = req.query.location
        }
        if(req.query.minPrice || req.query.maxPrice){
            query.price = {}
            if(req.query.minPrice){
                query.price.$gte = parseFloat(req.query.minPrice)
            }
            if(req.query.maxPrice){
                query.price.$lte = parseFloat(req.query.maxPrice)
            }
        }
        const products = await Product.find(query)
        res.json(products)
    }   
    catch (err) {
        console.error(err)
        res.status(500).json({message: "Server error"})
    }
})


router.get("/:id", verifyToken, async (req, res) => {
    try {
        const userId = req.user._id
        const productId = req.params.id
        const product = await Product.findOne({_id: productId, sellerId: userId})
        if (!product) {
            return res.status(404).json({message: "Product not found"})
        }
        res.json(product)
    } catch (err) {
        console.error(err)
        res.status(500).json({message: "Server error"})
    }
})



router.post("/addproduct", verifyToken, upload.single('image'), async (req, res) => {
    try {
        const userId = req.user._id
        const { title, description, price, category, condition, location } = req.body
        const images = []
        if (req.file) {
            // expose via /uploads route
            images.push(`/uploads/${req.file.filename}`)
        }
        const newProduct = new Product({ title, description, price, category, condition, images, location, sellerId: userId })
        await newProduct.save()
        res.status(201).json({ message: "Product added successfully", product: newProduct })
    } catch (err) {
        console.error(err)
        res.status(500).json({ message: "Server error" })
    }
})

router.put("/sold/:id",verifyToken,async(req,res)=>
{try
    {
        
    const userId = req.user._id
    const productId = req.params.id
    const product = await Product.findOne({_id:productId,sellerId:userId})
    if(!product)
    {
        return res.status(404).json({message:"Product not found"})
    }
    product.status = "Sold"
    await product.save()
    res.json({message:"Product marked as sold",product})
    }
    catch(err)
    {
        console.error(err)
        res.status(500).json({message:"Server error"})
    }
})

router.post("/message", verifyToken, async (req, res) => {
    try {
        const userId = req.user._id
        const { productId, message } = req.body
        const product = await Product.findById(productId)
        const newMessage = new Message({ senderId: userId, receiverId: product.sellerId, productId, message })
        await newMessage.save()
        res.status(201).json({message: "Message sent successfully", message: newMessage})
    } catch (err) {
        console.error(err)
        res.status(500).json({message: "Server error"})
    }
})


router.put("/:id", verifyToken, async (req, res) => {
    try {
        const userId = req.user._id
        const productId = req.params.id
        const { title, description, price, category, condition, location } = req.body
        const product = await Product.findOne({_id: productId, sellerId: userId})
        if (!product) {
            return res.status(404).json({message: "Product not found"})
        }
        const updatedProduct = await Product.findByIdAndUpdate(productId, {$set: {title, description, price, category, condition, location}}, {new: true})
        res.status(200).json({message: "Product updated successfully", product: updatedProduct})
    } catch (err) {
        console.error(err)
        res.status(500).json({message: "Server error"})
    }
})


router.delete("/deleteproduct/:id", verifyToken, async (req, res) => {
    console.log("Delete route hit")
    try {
        const userId = req.user._id
        const productId = req.params.id
        const product = await Product.findOne({_id: productId, sellerId: userId})
        if (!product) {
            return res.status(404).json({message: "Product not found"})
        }
        await Product.findByIdAndDelete(productId)
        console.log(`Deleted product with id: ${productId}`)
        res.status(200).json({message: "Product deleted successfully"})
    } catch (err) {
        console.error(err)
        res.status(500).json({message: "Server error"})
    }
})

module.exports = router