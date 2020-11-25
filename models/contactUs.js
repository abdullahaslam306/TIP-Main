const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const ContactUsSchema = new Schema({
    from: { type: String, required:true },
    subject: { type: String, required:true },
    message: { type: String, required:true },
},{timestamps : true  });

const ContactUs = mongoose.model('contactUs', ContactUsSchema);

module.exports = ContactUs;