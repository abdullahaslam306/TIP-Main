const express = require('express');
const loginController = require('../controllers/loginController');
const router = express.Router();
const adminController = require('../controllers/adminController');
const newsletterController = require('../controllers/newsletterController');
const transactionController = require('../controllers/transactionsController');
const ContactController = require('../controllers/contactUsController');
const NotificationController = require('../controllers/notificationController');
const testController = require('../controllers/testController');
const redirectLogin = (req, res, next) => {
    if(!req.session.user)
    {
      res.redirect('/');
    }
    else
    next();
      
  }

const redirectSubscribe = (req, res, next) => {
  if(req.session.subscribe == true)
  next();
  else
  {
    res.redirect('/user/subscribe');
  }
}

const redirectAdminLogin = (req, res, next) => {
    if(!req.session.user)
    {
      res.redirect('/admin/login')
    }
    else{
      next();
    }
  }
router.get('/', (req, res) => {
    res.render('index',{error:""});
  });

  router.get('/admin/removeCount',redirectAdminLogin,adminController.removeCount)
  router.get('/user/removeCount',redirectLogin,loginController.removeCount)
  router.get('/admin/notificationCount',redirectAdminLogin,adminController.NotificationCount)
router.get('/admin/dash',redirectAdminLogin,adminController.dash);
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
router.get('/admin/register',redirectAdminLogin,(req, res) => {res.render('register',{msg:""});});

router.post('/admin/newAdmin',redirectAdminLogin,adminController.register);
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
router.post('/user/pay',redirectLogin,redirectSubscribe,transactionController.userPayment)
router.get('/user/dash',redirectLogin,redirectSubscribe,loginController.dash)
router.get('/user/pay',redirectLogin,redirectSubscribe,(req, res)=>{res.render('user-pay',{fname:req.session.fname,success:"",failure:""})})
router.get('/user/profile',redirectLogin,(req, res)=>{
console.log(res.locals)
console.log(req.session)
res.render('user-profile',{
      fname:req.session.fname,
      lname:req.session.lname,
      email:req.session.user,
      phone: req.session.phone
    });
  })
 
//For testing purpose
//router.get('/test',transactionController.grouptest)


// @route of surveys 
router.get('/admin/surveys/list',redirectAdminLogin,adminController.loadSurvey)
router.get('/user/subscribe',redirectLogin,(req, res) => {res.render('subscribe')});
router.post('/user/subscribe',redirectLogin,transactionController.userSubscribe) 
router.get('/user/subscribe_pending',redirectLogin,(req,res)=>{res.render('subscribe_pending')});
router.get('/user/notificationCount',redirectLogin,loginController.NotificationCount)

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

//@ contact-Support Routes
router.get('/user/contact',redirectLogin,(req, res)=>{res.render('user-contact-support',{email:req.session.user,success:""})})
router.post('/user/contact/send',redirectLogin,ContactController.sendMessage)
router.get('/admin/contacts',redirectAdminLogin,ContactController.showMessages)
router.get('/admin/contact/reply/:id',redirectAdminLogin,ContactController.getMessage)
router.get('/admin/contact/delete/:id',redirectAdminLogin,ContactController.deleteMessage)
router.post('/admin/contact/reply',redirectAdminLogin,ContactController.sendReply)
  //@ user newsletter 
router.get('/user/news',redirectLogin,newsletterController.showNews)
// @ admin notifications
router.get('/admin/notification',redirectAdminLogin,(req, res)=>{res.render('send-Notification',{ sucess:"",failure:""})})
router.post('/admin/notification/send',redirectAdminLogin,NotificationController.sendNotification) 


// @Groups Link 
router.get('/admin/groups/list',redirectAdminLogin,adminController.viewGroups);
router.get('/admin/groups/details/:id',redirectAdminLogin,adminController.viewGroupsDetails);
router.get('/user/viewTransactions/',redirectLogin,transactionController.viewTransactionsUser);
router.get('/admin/viewTransactions',redirectAdminLogin,transactionController.viewTransactionsAdmin);
router.get('/user/request/',redirectLogin,loginController.withdrawform);
router.get('/admin/withdraw/request/',redirectAdminLogin,adminController.viewWithdrawRequest);
router.post('/user/request/',redirectLogin,redirectSubscribe,loginController.withdrawRequest);
router.post('/admin/pay/user',redirectAdminLogin,transactionController.payUser);
router.get('/test:id',redirectLogin,transactionController.getTransaction);
router.get('/admin/approve/request/:id',redirectAdminLogin,transactionController.approveRequest);
router.get('/admin/reject/request/:id',redirectAdminLogin,transactionController.rejectRequest
);

router.get('/user/balance',redirectLogin,transactionController.getBalance);



module.exports = router;
