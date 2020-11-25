const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const GroupSchema = new Schema({
    owneremail: { type: String, required:true,unique:true },
    memberscount: { type: number, required:true },
    level: { type: number, required:true}
},{timestamps : true  });


const Group = mongoose.model('group', Group);


module.exports = Group;