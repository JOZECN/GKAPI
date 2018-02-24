var express = require('express');
var router = express.Router();
var formidable = require('formidable');

var Temperature = require('../models/Temperature');

var responseData = null;
router.use(function(req,res,next){
    responseData = {
        code: 0,
        message: '',
        data: {
            control: ''
        }
    };
    next();
});

router.post('/temperatureCheck',function(req,res,next){
    var controlName = req.body.control || '';

    if(controlName != ''){
        Temperature.find().then(function(rs){
            if(rs != ''){
                if(controlName == 'null'){
                    Temperature.remove({
                        _id: rs[0]._id
                    }).then(function(){
                        Temperature.find().then(function(rsNew){
                            responseData.data.control = rsNew[0].control  == '' ? '未设定' : rsNew[0].control;
                            res.json(responseData);
                            return;
                        })
                    })
                }else{
                    Temperature.update({
                        _id: rs[0]._id
                    },{
                        control : controlName
                    }).then(function(){
                        Temperature.find().then(function(rsNew){
                            responseData.data.control = rsNew[0].control  == '' ? '未设定' : rsNew[0].control;
                            res.json(responseData);
                            return;
                        })
                    })
                }
            }else{
                new Temperature({
                    control : controlName
                }).save().then(function(){
                    res.json(responseData);
                    return;
                })
            }
        })
    }else{
        Temperature.find().then(function(rs){
            if(rs != ''){
                responseData.data.control = rs[0].control;
                res.json(responseData);
                return;
            }else {
                responseData.data.control = '未设定';
                res.json(responseData);
                return;
            }
        })
    }
});

router.post('/uploadImg', function(req, res, next) {
    var form = new formidable.IncomingForm();
    form.keepExtensions = true;
    form.uploadDir = __dirname + '/../public/upload/image';
    form.parse(req, function (err, fields, files) {
        console.log(files);
        if (err) {
            throw err;
        }
        if(files.file == undefined){
            Temperature.find().then(function(rs){
                if(rs == ''){
                    res.json('');
                    return;
                }else{
                    res.json(rs[0].imgUrl);
                    return;
                }
            })
        }else {
            var image = files.file;
            var path = image.path;
            path = path.replace('/\\/g', '/');
            var url = '/public/upload/image' + path.substr(path.lastIndexOf('/'), path.length);

            Temperature.find().then(function(rs){
                if(rs != ''){
                    Temperature.update({
                        _id: rs[0]._id
                    },{
                        imgUrl : url,
                    }).then(function(){
                        res.json(url);
                        return;
                    })
                }else{
                    new Temperature({
                        imgUrl : url
                    }).save().then(function(){
                        res.json(url);
                        return;
                    })
                }
            })
        }
    })
});

module.exports=router;