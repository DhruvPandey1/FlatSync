const express = require("express")
const cookie=require("cookie-parser");
const cors = require("cors")
require("dotenv").config()

const adminRoutes=require('./Admin/routes/adminRoutes.routes');
const userRoutes=require('./Users/routes/userRoutes.routes');
const googleAuth=require('./Admin/routes/googleAuth.routes')
const passport = require('passport')
const {configurePassport} = require("./Admin/controllers/passport.controller")
const pool = require("./db/db");

const app = express()

configurePassport(passport);

const PORT = process.env.PORT || 5000

app.use(cors({
  origin:'http://localhost:3000',
  credentials:true
}))
app.use(cookie());
app.use(express.json())
app.use(passport.initialize())

app.get("/", (req, res) => {
  res.send("Backend running")
})


app.use('/api',googleAuth);
app.use('/api/admin',adminRoutes);
app.use('/api/user',userRoutes);



app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})



app.get("/test-db", async (req, res) => {
  try {
    const result = await pool.query("SELECT NOW()")
    res.json(result.rows)
  } catch (err) {
    res.status(500).send(err.message)
  }
})

module.exports=app;