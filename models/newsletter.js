const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const NewsletterSchema = new Schema({
   
    title: { type: String, required:true },
    description :{ type: String, required:true},
    img: 
    { 
        data: Buffer, 
        contentType: String 
    } 

},{timestamps : true  });

const newsletter = mongoose.model('newsletter', NewsletterSchema);

module.exports = newsletter;