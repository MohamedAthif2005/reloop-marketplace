const express = require("express")
const router = express.Router()
const Product = require("../models/Product")
const Message = require("../models/Message")
const verifyToken = require("../middleware/middleware")

router.post("/", verifyToken, async (req, res) => {
    try {
        const userId = req.user._id;
        const { message, productId } = req.body;

        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        const receiverId = product.sellerId;
        if (!receiverId) {
            return res.status(400).json({ message: "Product owner not found" });
        }

        const newMessage = new Message({
            sender: userId,
            receiver: receiverId,
            productId,
            message
        });

        await newMessage.save();
        res.status(201).json({ message: "Message sent successfully", newMessage });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
});

router.post("/reply", verifyToken, async (req, res) => {
    try {
        const userId = req.user._id;
        const { message, senderId, productId } = req.body;

        const newMessage = new Message({
            sender: userId,
            receiver: senderId,
            productId,
            message
        });

        const savedMessage = await newMessage.save();
        const populatedMessage = await savedMessage
            .populate("sender", "name")
            .populate("receiver", "name")
            .populate("productId", "title");

        res.status(201).json({ successMessage: "Reply sent successfully", newMessage: populatedMessage });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Server error" });
    }
});

router.get("/", verifyToken, async (req, res) => {
    try {
        const userId = req.user._id;
        const messages = await Message.find({
            $or: [{ sender: userId }, { receiver: userId }]
        })
        .populate("sender", "name")
        .populate("receiver", "name")
        .populate("productId", "title");
        
        res.json(messages);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
});

router.delete("/conversation",verifyToken, async (req, res) => {
    try {
        const userId = req.user._id;
        const { otherUserId, productId } = req.body;
        await Message.deleteMany({
            $or: [
                { sender: userId, receiver: otherUserId, productId },
                { sender: otherUserId, receiver: userId, productId }
            ]
        });
        res.json({ message: "Conversation deleted successfully" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
});

module.exports = router;