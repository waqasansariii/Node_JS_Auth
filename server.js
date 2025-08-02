require('dotenv').config();
const express = require('express');
const serverless = require('serverless-http');

const connectToDB = require('./database/db.js');
const authRoutes = require('./routes/auth_routes.js');
const homeRoutes = require('./routes/home_routes.js');
const adminRoutes = require('./routes/admin_routes.js');
const uploadImageRoutes = require('./routes/image_routes.js');

const app = express();

// Connect to DB
connectToDB();

// Middlewares
app.use(express.json());
app.use('/api/auth', authRoutes);
app.use('/api/home', homeRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/image', uploadImageRoutes);

module.exports = app;
module.exports.handler = serverless(app); // ✅ only this for serverless
