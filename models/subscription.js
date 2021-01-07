const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const SubscriptionSchema = new Schema({
   
    option1:{type:Number, required:true,default:0},
    option2:{type:Number, required:true,default:0},
    option3:{type:Number, required:true,default:0},
    option4:{type:Number, required:true,default:0},
    option5:{type:Number, required:true,default:0}

    id:{type:Number, required:true,auto}
},{timestamps : true  });

const Subscription = mongoose.model('subscription', SubscriptionSchema);

module.exports = Subscription;