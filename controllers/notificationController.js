const nodemailer = require('nodemailer');
const Notification  = require("../models/notification")
const user=require('../models/logins');
const sendNotification = async (req, res) => {
    var obj = { 
        to: req.body.to, 
        subject: req.body.subject, 
        message:req.body.message
    } 
    Notification.create(obj, async (err, item) =>   { 
        if (err) { 
            console.log('Cannot Send Message');
            console.log(err); 
        } 
        
        else { 
            const output=req.body.message.toString();

            const to= req.body.to.toString();
            const subject=req.body.subject.toString();
            if(req.body.to.toString().toLowerCase()=='all')
            {
                user.find().sort({ createdAt: -1 })
                .then(result => {
                 result.forEach(element => {
                   const result= sendMail(element.email.toString(),subject,output)
                     
                 });
                 res.render('send-Notification',{ sucess:"Email Send to all",failure:""});
                })
                .catch(err => {
                  console.log(err);
                  res.render('send-Notification',{ sucess:"",failure:"Error! Email Not Send to all."});
                });
            }else{
            
           let result =  await sendMail(to,subject,output)
            
            console.log(result);
         
           if(result===true){
           res.render('send-Notification',{ sucess:`Notification sent to: ${to}`,failure:""}); 
           }
           else{
                console.log('Error in Sending E mail to ',to);
            res.render('send-Notification',{ sucess:"",failure:"Failed to send notification."}); 
           }
          
            
        }
    } 
    }); 
}
 async function sendMail(to,subject,message) {
   
    let transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
          user: 'abdullahaslammatrix@gmail.com', // email address
          pass: '4321Abdullah', // generated ethereal password
        },
      });

             // send mail with defined transport object
             let result = await transporter.sendMail({
              from: '"Abdullah Aslam 👻" <abdullahaslammatrix@gmail.com>', // sender address
              to: to, // list of receivers
              subject: subject, //✔", // Subject line
              text: "Hello world?", // plain text body
              html: message, // html body
            }).then( (resutlt) => {
              console.log(resutlt);
              return true;
            })
            return result;
  
    
 
}
module.exports ={sendNotification}