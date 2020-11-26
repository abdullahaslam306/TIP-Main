const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const LoginSchema = new Schema({
    email: { type: String, required:true,unique:true },
    password: { type: String, required:true },
    fname :{ type: String, required:true},
    lname :{ type: String, required:true },
    phone :{ type: String, required:true },
    isverified: { type: Boolean, required:true,default:true },
    refercode : { type:String, required:true,unique:true}
},{timestamps : true  });

const Login = mongoose.model('login', LoginSchema);

module.exports = Login;