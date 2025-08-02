const { default: mongoose } = require("mongoose")

const UserSchema = new mongoose.Schema({
    username: {type:String, required:true, unique:true,trim:true},
    email: {type:String, required:true, unique:true,trim:true,lowercase:true},
    password: {type:String, required:true},
    role: {type:String, required:true ,enum:['user','admin'], default:'user'}, //only allow 'user' or admin' as roles
    
},{timestamps:true});

module.exports = mongoose.model('User',UserSchema);