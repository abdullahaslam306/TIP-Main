
const Login = require('../models/logins');
const bcrypt = require('bcrypt');
const env = require('../config/env');
const nodemailer = require('nodemailer');
const { findByIdAndUpdate } = require('../models/logins');


const login = async (req, res) => {
    console.log('loginController');
    console.log(req.body);
    Login.findOne({email : req.body.email})
    .then(result => {
        console.log(result);
        if(result==null){
            res.json({msg:'Incorrect Email/Password',status:'failure'})
        }else{
        try{
           
            const flag =  bcrypt.compareSync(req.body.password,result.password) 
            

            if(flag && result.isverified){
               
                req.session.user = req.body.email;
                req.session.fname = result.fname;
                req.session.lname = result.lname;
                req.session.phone = result.phone;
                req.session.id=result.id;
                res.json({msg:'',status:'success'})
               
            }
            else if(result.isverified)
            {
                res.json({msg:'Incorrect Email/Password',status:'failure'})
                
            }
            else{
                res.json({msg:'User Email is not Verified.Kindly verify your email first.',status:'failure'})
                
            }
            
        }
        catch(err)
        {
            console.log(err);
            res.status(500).send(err.message);
        }}
        
    })
   
}
const updatePassword = async (req, res) => {
    
    const salt = await bcrypt.genSalt(10);
    const hasedpassword = await bcrypt.hash(req.body.newpassword, salt);
    Login.findOne({email:req.session.user})
    .then((login) => {
        console.log(login);
        const flag =  bcrypt.compareSync(req.body.oldpassword,login.password)
        if(flag){
            Login.findOneAndUpdate({email:req.session.user},{password:hasedpassword},{new:true})
            .then((result) => {
                res.render('user-changePass',{success:"Password has been changed successfully",failure:""});
            })
            .catch((err) => {console.log(err)
                res.render('user-changePass',{success:"",failure:"Something Went Wrong."});
            })
        }
        else{
            res.render('user-changePass',{success:"",failure:"You Entered Wrong Password."});
        }
    })
    .catch((err) => {console.log(err);
        res.render('user-changePass',{success:"",failure:"Something went wrong."});})
}
const register = async (req, res) => {

    try{
        const salt = await bcrypt.genSalt(10);
        const hasedpassword = await bcrypt.hash(req.body.password, salt);
        console.log(hasedpassword,salt);
        console.log(req.body);
        const login = new Login({
            email : req.body.email,
            password:hasedpassword,
            fname: req.body.fname,
            lname: req.body.lname,
            phone: req.body.phone
        });
        login.save()
        .then((result) =>{
            const output=`<p>YOU HAVE SUCESSFULLY REGISTERED
            Now verify your registeration by clicking the button below.</p>
            <br><a href='http://localhost:3900/verify/${result._id}'>Verify Me</a>
            `
            ;
            let transporter = nodemailer.createTransport({
                host: "smtp.gmail.com",
                port: 587,
                secure: false, // true for 465, false for other ports
                auth: {
                  user: '', // email address
                  pass: '', // generated ethereal password
                },
              });
            
              // send mail with defined transport object
                transporter.sendMail({
                from: '"Abdullah Aslam 👻" <abdullahaslammatrix@gmail.com>', // sender address
                to: "abdullahaslammatrix@gmail.com", // list of receivers
                subject: "Node Email Verificaltion ✔", // Subject line
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
        res.render('regform',{msg:"Sucessfully Registered. Now verify your Account "});
        }   )
        .catch(err =>{console.log(err); res.render('regform',{msg:"Something went wrong! Try Again Later. "});});
        }
        catch(err) {
        console.log(err);
        res.status(500).send();
    }

}

const logout = (req, res) => {
        req.session.destroy(err => {
            res.clearCookie(env.SESSION_NAME);
            res.redirect('/');
        });
}

const update = async (req, res) => {
    Login.findOneAndUpdate({email: req.session.user},req.body,{new:true})
    .then((result) => {console.log(result)
    res.render('user-profile', {
        
            fname:result.fname,
            lname:result.lname,
            email:req.session.user,
            phone: result.phone

    })})
    .catch((err) => {console.log(err);
        res.render('/user/profile');
    })
}
const verify = async (req, res) => {
    Login.findOneAndUpdate({_id: req.params.id},{isverified:true},{new:true})
    .then((result) => {console.log(result)
        res.redirect('/');})
    .catch((err) => {console.log(err);
        res.render('/user/profile');
    })
}
module.exports = {
 login,
 register,
 logout,
 update,
 updatePassword,
 verify
}