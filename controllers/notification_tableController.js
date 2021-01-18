const nodemailer = require('nodemailer');
const notification_table  = require("../models/notification_table")
const user=require('../models/logins');

const addNotification= async (_descriptionn,_too,_fromm) => {

   const notif= notification_table ({
    to: _too,
    description: _descriptionn,
    from: _fromm,
   
   });
   notif.save()
   .then((result) => {
       console.log("add A new Notification"+result)
   })
   .catch((error) => {
       console.log(error)
   })
}