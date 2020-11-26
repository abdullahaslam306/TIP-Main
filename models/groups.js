const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const GroupSchema = new Schema({
    owneremail: { type: String, required:true },
    members: [
            {
            email:{ type: String},
            }
        ]
    ,
    level: { type: Number, required:true},
    iscompleted: { type: Boolean, required:true}
},{timestamps : true  });


const Group = mongoose.model('group', GroupSchema);


module.exports = Group;