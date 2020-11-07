const express = require('express');
const loginController = require('../controllers/loginController');
const router = express.Router();
const adminController = require('../controllers/adminController');

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
  router.get('/admin/user/view',redirectAdminLogin,adminController.viewUsers);
  router.get('/admin/login', (req, res) => {res.render('logins');});
  router.post('/admin/login',adminController.login);
  router.get('/admin/register',(req, res) => {res.render('register');});
  router.post('/admin/register',adminController.register);

  router.post('/login',loginController.login);
  router.get('/login/add', async (req, res) => {res.render('register');})
  router.post('/login/add', loginController.register);
  
  router.get('/about',redirectLogin, (req, res) => {res.render('about', { title: 'About' });});

  router.get('/logout',redirectLogin,loginController.logout)

  router.get('/register', async (req, res) => {res.render('regform')})
  router.post('/register',loginController.register)

  router.get('/user/dash',redirectLogin,(req, res)=>{res.render('user-dash')})
  router.get('/user/profile',redirectLogin,(req, res)=>{
    console.log(res.locals)
    console.log(req.session)
    res.render('user-profile',{
      fname:req.session.fname,
      lname:req.session.lname,
      email:req.session.user,
      phone: req.session.phone
    });})
    router.get('/user/profile',redirectAdminLogin,(req, res)=>{
      console.log(res.locals)
      console.log(req.session)
      res.render('user-profile',{
        fname:req.session.fname,
        lname:req.session.lname,
        email:req.session.user,
        phone: req.session.phone
      });})
      
  router.post('/user/update',redirectLogin, loginController.update)
  router.get('/verify/:id',loginController.verify)
  router.get('/admin/user/edit/:id',redirectAdminLogin,adminController.getUser)
  router.post('/admin/user/update',redirectAdminLogin,adminController.updateUser)
  router.get('/admin/logout',redirectAdminLogin,adminController.logout)
  router.get('/admin/update/pass',redirectAdminLogin,(req, res) => {res.render('admin-chngePass',{success:"",failure:""})});
  router.post('/admin/update/pass',redirectAdminLogin,adminController.updatePassword);
  router.get('/user/update/pass',redirectAdminLogin,(req, res) => {res.render('user-changePass',{success:"",failure:""})});
  router.post('/user/update/pass',redirectAdminLogin,loginController.updatePassword);

module.exports = router;