const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const NotificationTableSchema = new Schema({
   
    to: { type: String, required:true },
    description: { type: String, required:true},
    from: { type: String, required:true},
    status:{type:Boolean, required:true,default:false}
    //false means not viewed by user yet

},{timestamps : true  });

const notification_table = mongoose.model('notification_table', NotificationTableSchema);

module.exports = notification_table;