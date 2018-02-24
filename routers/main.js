var express = require('express');
var router = express.Router();

var Temperature = require('../models/Temperature');

var responseData = null;
router.use(function(req,res,next){
    responseData={
        code: 0,
        message:'',
        data: {
            control: '',
            imgUrl: ''
        }
    };
    next();
});

router.get('/temperature',function(req,res,next){
    var controlName = req.query.control || '';
    if(controlName != ''){
        Temperature.find().then(function(rs){
            if(rs != ''){
                Temperature.update({
                    _id: rs[0]._id
                },{
                    control : controlName == '' ? rs[0].control : controlName,
                }).then(function(){
                    Temperature.find().then(function(rsNew){
                        responseData.data.control = rsNew[0].control == '' ? '未设定' : rsNew[0].control;
                        responseData.data.imgUrl = rsNew[0].imgUrl;
                        res.render('main/temperature',responseData);
                    })
                })
            }else{
                new Temperature({
                    control : controlName
                }).save().then(function(){
                    responseData.data.control = controlName;
                    res.render('main/temperature',responseData);
                })
            }
        })
    }else {
        Temperature.find().then(function(rs){
            if(rs == ''){
                responseData.data.control = '未设定';
                responseData.data.imgUrl = '';
                res.render('main/temperature',responseData);
            }else{
                responseData.data.control = rs[0].control == '' ? '未设定' : rs[0].control;
                responseData.data.imgUrl = rs[0].imgUrl;
                res.render('main/temperature',responseData);
            }
        })
    }
});

module.exports=router;