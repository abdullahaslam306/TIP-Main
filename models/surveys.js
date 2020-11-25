const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const SurveysSchema = new Schema({
   
    option1:{type:Number, required:true,default:0},
    option2:{type:Number, required:true,default:0},
    option3:{type:Number, required:true,default:0},
    option4:{type:Number, required:true,default:0},
    option5:{type:Number, required:true,default:0}
},{timestamps : true  });

const Surveys = mongoose.model('surveys', SurveysSchema);

module.exports = Surveys;