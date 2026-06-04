    const express = require("express")
    const mongoose = require("mongoose")

    const cors = require("cors")

    require("dotenv").config()


    const app = express()
    app.use(cors())
    app.use(express.json())

    const path = require('path')
    app.use('/uploads', express.static(path.join(__dirname, 'uploads')))

    app.use("/api/auth",require("./routes/authRoutes"))
    app.use("/user",require("./routes/profileRoute"))
    app.use("/dashboard",require("./routes/dashroute"))
    app.use("/products",require("./routes/productRoute"))
    app.use("/messages",require("./routes/messageRoute"))

    mongoose.connect(process.env.MONGO_URI)
    .then(()=>console.log("MongoDB Connected"))
    .catch(err=>console.error(err))


    const PORT = process.env.PORT || 5000

    app.listen(PORT,()=>
    {
        console.log(`Server running on ${PORT}`)
    })
