var mongoose=require('mongoose');

var temperatureSchema=require('../schemas/temperature');

mongoose.Promise = global.Promise;
module.exports=mongoose.model('Temperature',temperatureSchema);