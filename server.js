require('dotenv').config();
const serverless = require('serverless-http');
const express = require('express');
const connecToDB = require("./database/db.js");
const authRoutes = require("./routes/auth-routes.js");
const homeRoutes = require("./routes/home-routes.js");
const admin = require("./routes/admin-routes.js");
const uploadImageRoutes = require("./routes/image-routes.js");

const app = express();
// Middlewares
app.use(express.json()); // for parsing application/json
app.use('/api/auth',authRoutes);
app.use('/api/home',homeRoutes);
app.use('/api/admin',admin)
app.use('/api/image',uploadImageRoutes);
// Connect to the database
connecToDB();
const PORT = process.env.PORT || 3000;

// app.listen(PORT,()=>{
//     console.log(`Server is now liestening to port ${PORT}`)
// })  it is not support on the deployment on vercel
module.exports = serverless(app);