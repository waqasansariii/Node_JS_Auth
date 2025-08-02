const mongoose = require('mongoose');

require('dotenv').config();
const connecToDB = async()=>{
    try{
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Mongo db connected successfully")

    }
    catch(err){
        console.error("Error connecting to the database:", err);
        process.exit(1); // Exit the process with failure
    }
}
module.exports = connecToDB;