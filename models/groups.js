const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const GroupSchema = new Schema({
    members: [
            {
            email:{ type: String},
            }
        ]
    ,
    status: { type: String,enum :["INCOMPLETE","COMPLETE","PAID"], required:true}
},{timestamps : true  });


const Group = mongoose.model('group', GroupSchema);


module.exports = Group;