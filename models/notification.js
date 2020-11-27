const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const NotificationSchema = new Schema({
   
    to: { type: String, required:true },
    subject :{ type: String, required:true},
    message :{ type: String, required:true}


},{timestamps : true  });

const Notification = mongoose.model('notification', NotificationSchema);

module.exports = Notification;