var mongoose=require('mongoose');

module.exports= new mongoose.Schema({
    control: {
        type: String,
        default: ''
    },
    imgUrl: {
        type: String,
        default: ''
    }
});