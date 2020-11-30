const nodemailer = require('nodemailer');
const ContactUs  = require("../models/contactUs")
function isEmpty(obj) {
    for(var key in obj) {
        if(obj.hasOwnProperty(key))
            return true;
    }
    return false;
}
const viewNews= async (req,res)=>{
    newsletter.find({}, (err, items) => { 
        if (err) { 
            console.log(err); 
        } 
        else { 
            if(isEmpty(req.query)){
                console.log(req.query)
                res.render('newsletter', { items: items ,message:req.query.abc });}
            else{
                console.log('Not found')
                console.log(req.query)
                res.render('newsletter', { items: items ,message:''});
            }  
           
        } 
    }); 
}
const sendMessage=async (req, res) => {
    var obj = { 
        from: req.body.from, 
        subject: req.body.subject, 
        message:req.body.message
    } 
    ContactUs.create(obj, (err, item) => { 
        if (err) { 
            console.log('Cannot Send Message');
            console.log(err); 
        } 
        else { 
            const output=`<head>
            <meta name='viewport' content='width=device-width, initial-scale=1, maximum-scale=1'>
        </head>
        <body style='font-family:Verdana;background:#f2f2f2;color:#606060;'>
    
            <style>
                h3 {
                    font-weight: normal;
                    color: #999999;
                    margin-bottom: 0;
                    font-size: 14px;
                }
                a , h2 {
                    color: #6534ff;
                }
                p {
                    margin-top: 5px;
                    line-height:1.5;
                    font-size: 14px;
                }
            </style>
    
            <table cellpadding='0' width='100%' cellspacing='0' border='0'>
                <tr>
                    <td>
                        <table cellpadding='0' cellspacing='0' border='0' align='center' width='100%' style='border-collapse:collapse;'>
                            <tr>
                                <td>
    
                                    <div>
                                        <table cellpadding='0' cellspacing='0' border='0' align='center'  style='width: 100%;max-width:600px;background:#FFFFFF;margin:0 auto;border-radius:5px;padding:50px 30px'>
                                            <tr>
                                                <td width='100%' colspan='3' align='left' style='padding-bottom:0;'>
                                                    <div>
                                                        <h2>New message</h2>
                                                    </div>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td width='100%' align='left' style='padding-bottom:30px;'>
                                                    <div>
                                                        <p>Hello, you've just received a new message via the contact form on your website.</p>
                                                    </div>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td width='100%' align='left' style='padding-bottom:20px;'>
                                                    <div>
                                                        <h3>From</h3>
                                                        <p>${req.body.from}</p>
                                                    </div>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td width='100%' align='left' style='padding-bottom:20px;'>
                                                    <div>
                                                        <h3>Subject</h3>
                                                        <p>${req.body.subject}</p>
                                                    </div>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td width='100%' align='left' style='padding-bottom:20px;'>
                                                    <div>
                                                        <h3>Message</h3>
                                                        <p>${req.body.message}</p>
                                                    </div>
                                                </td>
                                            </tr>
                                        </table>
                                    </div>
    
                                    <div style='margin-top:30px;text-align:center;color:#b3b3b3'>
                                        <p style='font-size:12px;'>2020 The Isaiah Project®, All Rights Reserved.</p>
                                    </div>
                                </td>
                            </tr>
                        </table>
                    </td>
                </tr>
            </table>
        </body>
                `
                ;
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
                    transporter.sendMail({
                    from: '"Abdullah Aslam 👻" <abdullahaslammatrix@gmail.com>', // sender address
                    to: "abdullahaslammatrix@gmail.com",
                    replyTo:req.body.from.toString(), // list of receivers
                    subject: "New Message From User", //✔", // Subject line
                    text: "Hello world?", // plain text body
                    html: output, // html body
                  },(err,info)=>{
                      if(err)
                      {
                          console.log(err)
                      }
                      else{
                        console.log("Message sent: %s", info.messageId);
                        console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
                       console.log("Email Sent Successfully!")
                      }
                  });    
            // item.save(); 
            res.render('user-contact-support',{email: req.body.email,success:"Message Sent Successfully"}); 
        } 
    }); 
}

const showMessages= async(req, res)=>{
    ContactUs.find().sort({ createdAt: -1 })
    .then(result => {
        if(isEmpty(req.query)){
            console.log(req.query)
          res.render('admin-view-contacts', { messages: result,msg:req.query.abc });}
        else{
            console.log('Not found')
            console.log(req.query)
            res.render('admin-view-contacts', { messages: result,msg:''});
        }  
        })
        .catch(err => {
          console.log(err);
        });
   
}
const getMessage = async (req, res) => {
    ContactUs.findById(req.params.id)
    .then((msg) => {
        console.log(msg);
        res.render('admin-reply-contact',msg)
    }
    )
    .catch((err)=>{console.log(err);})
}
const sendReply=async (req, res) => {
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
        transporter.sendMail({
        from: '"Abdullah Aslam 👻" <abdullahaslammatrix@gmail.com>', // sender address
        to: req.body.replyto.toString(), // list of receivers
        subject: "RE:"+" "+req.body.subject.toString(), //✔", // Subject line
        text: req.body.reply.toString(), // plain text body
        // html: output, // html body
      },(err,info)=>{
          if(err)
          {
              console.log(err)
          }
          else{
            console.log("Message sent: %s", info.messageId);
            console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
           console.log("Email Sent Successfully!")
           res.redirect('/admin/contacts?Reply Sent');
          }
      });   } 
// item.save(); 
const deleteMessage= async (req, res) => {
    ContactUs.findByIdAndRemove(req.params.id)
    .then((result) => {console.log(result);  res.redirect('/admin/contacts?abc=Deleted Successfully')})
    .catch((err) => {console.log(err); res.redirect('/admin/contacts')})

}

module.exports ={sendMessage,showMessages,getMessage,sendReply,deleteMessage}