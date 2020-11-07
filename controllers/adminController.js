
const Admin = require('../models/admins');
const Login = require('../models/logins');
const bcrypt = require('bcrypt');
const env = require('../config/env')


const login = async (req, res) => {
   
    Admin.findOne({email : req.body.email})
    .then(result => {
        console.log(result);
        try{
            const flag =  bcrypt.compareSync(req.body.password,result.password) 
            if(flag){
                req.session.user = req.body.email;
                req.session.fname = result.fname;
                req.session.lname = result.lname;
                req.session.phone = result.phone;
            
                res.render('admin-dash');
            }
            else
            {
                res.render("index",{error:"Incorrect Email or Password"});
            }
            
        }
        catch(err)
        {
            console.log(err);
            res.status(500).send(err.message);
        }
        
    })
   
}
const viewUsers=(req,res)=>{
    Login.find().sort({ createdAt: -1 })
    .then(result => {
      res.render('viewUsers', { users: result });
    })
    .catch(err => {
      console.log(err);
    });
}
const logout = (req, res) => {
        req.session.destroy(err => {
            res.clearCookie(env.SESSION_NAME);
            res.redirect('/admin/login');
        });
}

const update =  (req, res) => {
    Admin.findOneAndUpdate(
        {email: req.body.email},
        req.body,
        {returnNewDocument:true},
        (err,doc) => {
        if(!err)
        {
            console.log(doc)
            console.log('success');
        }
    })
}

const getUser = async (req, res) => {
    Login.findById(req.params.id)
    .then((user) => {
        res.render('admin-editUser',user)
    }
    )
    .catch((err)=>{console.log(err);})
}



const register = async (req, res) => {

    try{
        const salt = await bcrypt.genSalt(10);
        const hasedpassword = await bcrypt.hash(req.body.password, salt);
        console.log(hasedpassword,salt);
        console.log(req.body);
        const admin = new Admin({
            email : req.body.email,
            password:hasedpassword,
        });
        admin.save()
        .then((result) =>{
        res.redirect('/admin/login');
        }   )
        .catch(err =>{console.log(err);});
        }
        catch(err) {
        console.log(err);
        res.status(500).send();
    }
    
}

const updatePassword = async (req, res) => {
    
    const salt = await bcrypt.genSalt(10);
    const hasedpassword = await bcrypt.hash(req.body.newpassword, salt);
    Admin.findOne({email:req.session.user})
    .then((admin) => {
        const flag =  bcrypt.compareSync(req.body.oldpassword,admin.password)
        if(flag){
            Admin.findOneAndUpdate({email:req.session.user},{password:hasedpassword},{new:true})
            .then((result) => {
                res.render('admin-chngePass',{success:"Password has been changed successfully"});
            })
            .catch((err) => {console.log(err);
                res.render('admin-chngePass',{success:"",failure:"Something went wrong."});})
        }  else{
            res.render('admin-chngePass',{success:"",failure:"You Entered Wrong Password."});
        }
    })
    .catch((err) => {console.log(err);
        res.render('admin-chngePass',{success:"",failure:"You Entered Wrong Password."})})
}
const updateUser = async (req, res) => {

    if(req.body.password === ""){
    Login.findOneAndUpdate({email: req.body.email},{
      phone:req.body.phone,
      fname:req.body.fname,
      lname:req.body.lname  
    },{new:true})
    .then((result) => {console.log(result);
    res.redirect('/admin/user/view')})
    .catch((err) => {console.log(err);
    res.redirect('/admin/user/edit');});
    }
    else{
        const salt = await bcrypt.genSalt(10);
        const hasedpassword = await bcrypt.hash(req.body.password, salt);
        Login.findOneAndUpdate({email: req.body.email},{
            phone:req.body.phone,
            fname:req.body.fname,
            lname:req.body.lname,  
            password:hasedpassword
          },{new:true})
          .then((result) => {console.log(result);
          res.redirect('/admin/user/view')})
          .catch((err) => {console.log(err);
          res.redirect('/admin/user/edit');});
    }
}

const removeUser= async (req, res) => {
    console.log('Delete Req')
    console.log(req)
    Login.findByIdAndRemove(req.params.id)
    .then((result) => {console.log(result); viewUsers()})
    .catch((err) => {console.log(err);viewUsers()})
}
module.exports = {
 login,
 logout,
 register,
 update,
 viewUsers,
 getUser,
 updateUser,
 updatePassword,
 removeUser
}