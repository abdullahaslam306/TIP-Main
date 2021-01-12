const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const LoginSchema = new Schema({
    email: { type: String, required:true,unique:true },
    password: { type: String, required:true },
    fname :{ type: String, required:true},
    lname :{ type: String, required:true },
    phone :{ type: String, required:true },
    isverified: { type: Boolean, required:true,default:true },
    balance :{ type: Number, required:true,default:0 },
    isSubscribed: { type: Boolean, required:true,default:false},
},{timestamps : true  });

const Login = mongoose.model('login', LoginSchema);

module.exports = Login;