const express = require('express');
const loginController = require('../controllers/loginController');
const router = express.Router();
const adminController = require('../controllers/adminController');
const newsletterController = require('../controllers/newsletterController');
const redirectLogin = (req, res, next) => {
    if(!req.session.user)
    {
      res.redirect('/')
    }
    else{
      next()
    }
  }
  const redirectAdminLogin = (req, res, next) => {
    if(!req.session.user)
    {
      res.redirect('/admin/login')
    }
    else{
      next()
    }
  }
router.get('/', (req, res) => {
    res.render('index',{error:""});
  });
  router.get('/admin/dash',redirectAdminLogin, (req, res) => {
    res.render('admin-dash');
  });
  router.get('/admin/lock',redirectAdminLogin,adminController.lock)
  router.post('/admin/login/lock',adminController.locklogin);
  // router.get('/admin/logout',redirectAdminLogin,adminController.logout)
  router.get('/admin/user/view',redirectAdminLogin,adminController.viewUsers);
  router.get('/admin/login', (req, res) => {res.render('logins',{msg:"No"});});
  router.post('/admin/login',adminController.login);
  router.get('/admin/view',redirectAdminLogin,adminController.viewAdmin);
  router.get('/admin/edit/:id',redirectAdminLogin,adminController.getAdmin)
  router.post('/admin/update',redirectAdminLogin,adminController.updateAdmin);
  router.get('/admin/delete/:id',redirectAdminLogin,adminController.removeAdmin);
  router.get('/admin/register',(req, res) => {res.render('register',{msg:""});});
  
  router.post('/admin/newAdmin',adminController.register);
  router.post('/login',loginController.login);
  router.get('/login/add', async (req, res) => {res.render('register');})
  router.post('/login/add', loginController.register);
  
  router.get('/about',redirectLogin, (req, res) => {res.render('about', { title: 'About' });});

  router.get('/logout',redirectLogin,loginController.logout)

  router.get('/register', async (req, res) => {res.render('regform',{msg:"NO",failure:'NO'})})
  router.post('/register',loginController.register)

// @newsletter routes
router.get('/admin/newsletter',redirectAdminLogin,newsletterController.viewNews);
router.post('/upload/newsletter',redirectAdminLogin,
    newsletterController.upload.single('image'),
    newsletterController.addnews)

router.get('/admin/newsletter/edit/:id',redirectAdminLogin,newsletterController.getNews)
router.post('/update/newsletter',redirectAdminLogin,
newsletterController.upload.single('image'),
newsletterController.updateNews)
router.get('/admin/newsletter/delete/:id',redirectAdminLogin,newsletterController.deleteNews)
router.get('/admin/newsletter/new',redirectAdminLogin,(req,res)=>{res.render('addNewsletter')})

router.get('/user/pay',redirectLogin,(req, res)=>{res.render('user-pay',{fname:req.session.fname})})
  router.get('/user/dash',redirectLogin,(req, res)=>{res.render('user-dash',{fname:req.session.fname})})
  router.get('/user/profile',redirectLogin,(req, res)=>{
    console.log(res.locals)
    console.log(req.session)
    res.render('user-profile',{
      fname:req.session.fname,
      lname:req.session.lname,
      email:req.session.user,
      phone: req.session.phone
    });})
 
 // @route of surveys 
 router.get('/admin/surveys/list',redirectAdminLogin,(req, res)=>{res.render('surveys')})
 

  router.post('/user/update',redirectLogin, loginController.update)
  router.get('/verify/:id',loginController.verify)
  router.get('/admin/user/edit/:id',redirectAdminLogin,adminController.getUser)
  router.post('/admin/user/update',redirectAdminLogin,adminController.updateUser)
  router.get('/admin/user/delete/:id',redirectAdminLogin,adminController.removeUser)
  router.get('/admin/logout',redirectAdminLogin,adminController.logout)
  router.get('/admin/update/pass',redirectAdminLogin,(req, res) => {res.render('admin-chngePass',{success:"",failure:""})});
  router.post('/admin/update/pass',redirectAdminLogin,adminController.updatePassword);
  router.get('/user/update/pass',redirectLogin,(req, res) => {res.render('user-changePass',{success:"",failure:""})});
  router.post('/user/update/pass',redirectLogin,loginController.updatePassword);


  //@ user newsletter 
   router.get('/user/news',redirectLogin,newsletterController.showNews)
module.exports = router;