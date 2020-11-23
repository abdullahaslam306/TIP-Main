const fs = require('fs'); 
const path = require('path'); 
const multer = require('multer'); 
const newsletter = require('../models/newsletter'); 
const storage = multer.diskStorage({ 
    destination: (req, file, cb) => { 
        cb(null, './public/uploads') 
    }, 
    filename: (req, file, cb) => { 
        cb(null, file.fieldname + '-' + Date.now()) 
    } 
}); 



const upload = multer({ storage: storage }); 
const viewNews= async (req,res)=>{
    newsletter.find({}, (err, items) => { 
        if (err) { 
            console.log(err); 
        } 
        else { 
            // console.log(items);
            res.render('newsletter', { items: items }); 
        } 
    }); 
} 
const addnews= async (req, res) => {
   
    console.log("IN tHIS fUNCTION")
    console.log(req.file)
    var obj = { 
        title: req.body.title, 
        description: req.body.description, 
        img: { 
            data: fs.readFileSync(path.join('./public/uploads/' + req.file.filename)), 
            contentType: 'image/png'
        } 
    } 
    newsletter.create(obj, (err, item) => { 
        if (err) { 
            console.log(err); 
        } 
        else { 
            // item.save(); 
            res.redirect('/admin/newsletter'); 
        } 
    }); 
}
const getNews= async (req, res) => {
    newsletter.findById(req.params.id)
    .then((news) => {
        // console.log(news);
        res.render('editNewsletter',news)
    }
    )
    .catch((err)=>{console.log(err);})
}
const updateNews= async (req, res) => {
     console.log('--------------------------------------------------------------')
     console.log('image ....')
    
    if(!req.file){
        console.log("Image not found!")
       
        newsletter.findOneAndUpdate({_id: req.body.id},{
          title: req.body.title,
          description:req.body.description,
         
        },{new:true})
        .then((result) => {console.log(result);
        res.redirect('/admin/newsletter')})
        .catch((err) => {console.log(err);
        res.redirect('/admin/newsletter');});
        }
        else{
            console.log('Loging here')
           console.log(req.body.id)
            upload.single('image')
            newsletter.findOneAndUpdate({_id: req.body.id },{
                title:req.body.title,
          description:req.body.description,
          img: { 
            data: fs.readFileSync(path.join('./public/uploads/' + req.file.filename)), 
            contentType: 'image/png'
        } 
              },{new:true})
              .then((result) => {console.log(result);
              res.redirect('/admin/newsletter')})
              .catch((err) => {console.log(err);
              res.redirect('/admin/newsletter');});
        }
}
const deleteNews= async (req, res) => {
    console.log('Delete Req')
    console.log(req)
    newsletter.findByIdAndRemove(req.params.id)
    .then((result) => {console.log(result);  res.redirect('/admin/newsletter')})
    .catch((err) => {console.log(err); res.redirect('/admin/newsletter')})
}
module.exports = {viewNews,upload,addnews,getNews,updateNews,deleteNews}
