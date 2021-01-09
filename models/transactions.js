const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const TransactionSchema = new Schema({
   
    userid: {type: String, required:true},
    txType: {type:String,enum:["SUB","DIS","PAY","WIT"],required:true},
    amount:{ type: Number, required:true},
    status: {type:String,enum:["COMPLETE","PENDING","FAILED"], required:true}

},{timestamps : true  });

const Transaction = mongoose.model('Transaction', TransactionSchema);

module.exports = Transaction;