'use strict'
var through2 = require('through2');
var fs=require('fs');
module.exports = modify;
function modify(){
    return through2.obj(function(file, encoding, cb){
        //如果文件为空，不做任何操作，转入下一个操作，即下一个pipe
        if(file.isNull()){
            this.push(file);
            return cb();
        }
        //插件不支持对stream直接操作，抛出异常
        if(file.isStream()){
            this.emit('error');
            return cb();
        }
        
        var p=file.path.replace(__dirname+'\\src\\html\\','').split('\\')
        var path=''
        p.forEach(()=>{
            path=path+'../'
        })
        //内容转换，处理好后，再转成Buffer形式
        var content = replace(file.contents.toString(),path);
        file.contents = new Buffer(content);
        //下面这两句基本是标配，可参考through2的API
        this.push(file);
        cb();
    });
}
function replace(data,path){
    //插入css和js
    var configPath=`${__dirname}/src/config.json`
    var config=fs.readFileSync(configPath, 'utf-8');
    var css=JSON.parse(config).import.css
    var js=JSON.parse(config).import.js
    var csslinks=''
    css.list.forEach((item)=>{
        var link=''
        if(item.indexOf('http')!=-1){
            link=item
        }else{
            link=path+item
        }
        csslinks=`${csslinks} <link rel="stylesheet" href="${link}">`
    })
    var jslinks=''
    js.list.forEach((item)=>{
        var link=''
        if(item.indexOf('http')!=-1){
            link=item
        }else{
            link=path+item
        }
        jslinks=`${jslinks} <script src="${path+item}"></script>`
    })
    data=data.replace(`${css.target}`, csslinks);
    data=data.replace(`${js.target}`, jslinks);

    //替换变量字符串
    var variable=JSON.parse(config).variable
    for(var k in variable.word){
        var exg=`${variable.targetStart}${k}${variable.targetEnd}`
        data=data.replace(new RegExp(exg,'g'), variable.word[k]);
    }
    return data
}
