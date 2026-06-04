const express = require("express")
const router = express.Router()
const User = require("../models/User")
const verifyToken = require("../middleware/middleware")
const bcrypt = require("bcryptjs")

router.get("/profile", verifyToken, async (req, res) => {
    try {
        const user = req.user
        if (!user) {
            return res.status(400).json({ message: "User not found" })
        }

        const { password, ...profile } = user.toObject()
        res.json(profile)
    } catch (err) {
        res.status(500).json({ message: "Server error" })
    }
})

router.patch("/profile", verifyToken, async (req, res) => {
    try {
        const user = req.user
        if (!user) {
            return res.status(400).json({ message: "User not found" })
        }

        const updates = ["name", "email", "phone", "city"]
        updates.forEach((field) => {
            if (req.body[field] !== undefined) {
                user[field] = req.body[field]
            }
        })

        await user.save()
        const { password, ...profile } = user.toObject()
        res.json(profile)
    } catch (err) {
        res.status(500).json({ message: "Unable to update profile" })
    }
})

router.patch("/passchange", verifyToken, async (req, res) => {

    try {

        const user = req.user
        if (!user) {
            return res.status(400).json({
                message: "User not found"
            })
        }
        const { oldpass, newpass } = req.body

        if (!oldpass || !newpass) {
            return res.status(400).json({
                message: "All fields required"
            })
        }
        const match = await bcrypt.compare(
            oldpass,
            user.password
        )
        if (!match) {
            return res.status(400).json({
                message: "Incorrect old password"
            })
        }
        if (oldpass === newpass) {
            return res.status(400).json({
                message: "Old password same as new password"
            })
        }

        user.password = await bcrypt.hash(
            newpass,
            10
        )

        await user.save()
        return res.status(200).json({
            message: "Password changed successfully"
        })
    }
    catch (err) {
        console.log(err)
        return res.status(500).json({
            message: "Server error"
        })
    }
})
module.exports = router