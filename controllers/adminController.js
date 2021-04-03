
const Admin = require('../models/admins');
const Login = require('../models/logins');
const bcrypt = require('bcrypt');
const Group=require('../models/groups');
const env = require('../config/env');
const WithRequest=require("../models/withdrawRequest")
const notification_table=require("../models/notification_table")

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
            
                res.redirect('/admin/dash');
            }
            else
            {
                res.render("logins",{msg:"Yes"});
            }
            
        }
        catch(err)
        {
            console.log(err);
            res.render("logins",{msg:"Yes"});
        }
        
    })
   
}
const locklogin= async (req, res) => {
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
                res.render("lockscreen",{email:req.body.email,msg:"Yes"});
            }
            
        }
        catch(err)
        {
            console.log(err);
            res.render("lockscreen",{email:req.body.email,msg:"Yes"});
        }
        
    })
}
function isEmpty(obj) {
    for(var key in obj) {
        if(obj.hasOwnProperty(key))
            return true;
    }
    return false;
}
const viewUsers=(req,res)=>{
   
    Login.find().sort({ createdAt: -1 })
    
    .then(result => {
    if(isEmpty(req.query)){
        console.log(req.query)
      res.render('viewUsers', { users: result,message:req.query.abc });}
    else{
        console.log('Not found')
        console.log(req.query)
        res.render('viewUsers', { users: result,message:''});
    }  
    })
    .catch(err => {
      console.log(err);
    });
}
const viewAdmin=(req,res)=>{
    Admin.find().sort({ createdAt: -1 })
    .then(result => {
        if(isEmpty(req.query)){
            console.log(req.query)
            res.render('viewAdmin', { admins: result,message:req.query.abc });}
        else{
            console.log('Not found')
            console.log(req.query)
            res.render('viewAdmin', { admins: result,message:''});
        }  })
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
const lock = (req, res) => {
        const mail=req.session.user;
        req.session.destroy(err => {
        res.clearCookie(env.SESSION_NAME);
        res.render('lockscreen',{email:mail,msg:"no"});
    });
}

const loadSurvey= async (req, res) => {
res.render('surveys');

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
const getAdmin = async (req, res) => {
    Admin.findById(req.params.id)
    .then((admin) => {
        res.render('editAdmin',admin)
    }
    )
    .catch((err)=>{console.log(err);})
}

const viewGroups= async (req, res) => {
   Group.find().sort({ createdAt: -1 })
   .then((group) => {
       res.render('viewGroups',{groups:group})
   })
   .catch((err) => {console.log(err)})
}
const viewGroupsDetails= async (req, res) => {

     Group.findById(req.params.id)
    .then((group) => {
       
        res.render('GroupDetails',{groups:group})
    })
    .catch((err) => {console.log(err)})
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
        res.redirect('/admin/view');
        }   )
        .catch(err =>{console.log(err);
            res.render('/admin/register',{msg:"Error! Something went wrong..."});});
        }
        catch(err) {
        console.log(err);
        res.render('/admin/register',{msg:"Error! Something went wrong..."});
    }
    
}


const viewWithdrawRequest =async (req, res) => {
    WithRequest.find().sort({createdAt: 1 })
    .then((result)=>{console.log(result);
    res.render('requestlist',{requests:result,success:"",failure:""})
    
    })
    .catch((err)=>{console.log(err);})
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
                res.render('admin-chngePass',{success:"Password has been changed successfully",failure:""});
            })
            .catch((err) => {console.log(err);
                res.render('admin-chngePass',{success:"",failure:"Something went wrong."});})
        }  else{
            res.render('admin-chngePass',{success:"",failure:"Your Current Password is not Correct."});
        }
    })
    .catch((err) => {console.log(err);
        res.render('admin-chngePass',{success:"",failure:"Your Current Password is not Correct."})})
}
const updateUser = async (req, res) => {

    if(req.body.password === ""){
    Login.findOneAndUpdate({email: req.body.email},{
      phone:req.body.phone,
      fname:req.body.fname,
      lname:req.body.lname  
    },{new:true})
    .then((result) => {
    res.redirect('/admin/user/view?abc=Successfully Edited.')})
    .catch((err) => {console.log(err); res.render('editAdmin',{email:req.body.email})});
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
          res.redirect('/admin/user/view?abc=Successfully Edited')})
          .catch((err) => {console.log(err);
          res.redirect('/admin/user/edit');});
    }
}

const updateAdmin = async (req, res) => {

    if(req.body.password === ""){
    
    res.redirect('/admin/user/edit');
    }
    else{
        const salt = await bcrypt.genSalt(10);
        const hasedpassword = await bcrypt.hash(req.body.password, salt);
        Admin.findOneAndUpdate({email: req.body.email},{
           
            password:hasedpassword
          },{new:true})
          .then((result) => {console.log(result);
          res.redirect('/admin/view?abc=Sucessfully Edited ')})
          .catch((err) => {console.log(err);
          res.redirect('/admin/edit');});
    }
}


const removeUser= async (req, res) => {
   
    Login.findByIdAndRemove(req.params.id)
    .then((result) => {
        // console.log(result);          
        res.redirect('/admin/user/view?abc=Sucessfully Deleted');})
    .catch((err) => {console.log(err); res.redirect('/admin/user/view')})
}
const removeAdmin= async (req, res) => {
    console.log('Delete Req')
    console.log(req)
    Admin.findByIdAndRemove(req.params.id)
    .then((result) => {res.redirect('/admin/view?abc=Sucessfully Deleted')})
    .catch((err) => {res.redirect('/admin/view')})
}

const dash  = async (req, res) => {
    
   var abc=0;
    notification_table.find({status: false, to:'admin'})
    .then((result) => {
        abc=result.length;
        res.render('admin-dash',{not_count:abc});
    })

        
    
   
}
const NotificationCount=async (req,res)=>{
    var abc=0;
    notification_table.find({status: false, to:'admin'})
    .then((result) => {
        console.log(result)
        res.json({notifications:result,status:'success'})
       
    })
    .catch((err)=>{console.log(err)})
   

}
const removeCount=async (req,res)=>{
  notification_table.updateMany({to:'admin',status:false},{status:true})
  .then((result) => {
    console.log(result)
    res.json({readstatus:'success',status:'success'})
    })
    .catch((err)=>{

        console.log(err)
        
    })

}

module.exports = {
 login,
 dash,
 logout,
 register,
 update,
 viewUsers,
 getUser,
 updateUser,
 updatePassword,
 removeUser,
 viewAdmin,
 getAdmin,
 removeAdmin,
 updateAdmin,
 lock,
 locklogin,
 loadSurvey,
 viewGroups,
 viewGroupsDetails,
 viewWithdrawRequest,
 NotificationCount,
 removeCount
 
}