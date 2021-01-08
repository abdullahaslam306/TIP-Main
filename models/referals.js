const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const ReferalsSchema = new Schema({
   referredBy: { type: Schema.Object.Id ,  required:true},
   userid:   { type: Schema.Object.Id , required:true}
},{timestamps : true  });

const Referals = mongoose.model('Referals', ReferalsSchema);

module.exports = Referals;