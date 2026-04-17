const express = require("express")
const mongoose = require("mongoose")
const cors = require("cors")
require("dotenv").config()

const app = express()

const authRoutes = require("./routes/authRoutes")
const productRoutes = require("./routes/productRoutes") // ✅ ADD THIS

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// ROUTES
app.use("/api/auth", authRoutes)
app.use("/api/product", productRoutes)

// TEST ROUTE
app.get("/", (req, res) => {
    res.json({ message: "server is running" })
})

// DB CONNECTION
mongoose.connect(process.env.MONGODB_URL)
    .then(() => {
        console.log("DB connected")

        app.listen(5000, () => {
            console.log("server runs on port 5000")
        })
    })
    .catch((err) => {
        console.log(err)
    })