const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const withdrawRequestSchema = new Schema({
   
    userid: {type: String, required:true},
    amount:{ type: Number, required:true},
    status: {type:String,enum:["APPROVED","PENDING","FAILED"], required:true}

},{timestamps : true  });

const widrawRequest = mongoose.model('widrawRequest', withdrawRequestSchema);

module.exports = widrawRequest;