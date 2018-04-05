var express=require('express');
var app=express();
var path = require('path');
var mongoose=require('mongoose');
var bodyParser=require('body-parser');

app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));

app.use('/public',express.static(__dirname+'/public'));

var swig=require('swig');
app.engine('html',swig.renderFile);
app.set('views','./views');
app.set('view engine','html');
swig.setDefaults({cache:false});

app.use('/api',require('./routers/api'));
app.use('/',require('./routers/main'));

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/gkapi9001',function(err){
    if(err){
        console.log('数据库连接错误！');
    }else{
        console.log('数据库连接成功！');
        app.listen(9001);
    }
});