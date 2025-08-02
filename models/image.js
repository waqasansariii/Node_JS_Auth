const mongoose = require('mongoose');

const ImageaSchema = new mongoose.Schema({
    url:{type:String, required:true},
    publicId:{type:String, required:true},
    uploadedBy:{type:mongoose.Schema.Types.ObjectId, ref:'User',required:true},

},{timestamps:true});
module.exports = mongoose.model('Image', ImageaSchema);