/*
var mongoose = require('mongoose');
//var socketio=require('socket.io');
client = require('socket.io').listen(3000).sockets;
var express=require('express');
app=express();

var http = require('http').Server(app);

var config = require('./config'); 

mongoose.connect(config.database,function(err){

if(err)
{
	console.log(err);
 
}      

else
	console.log("Connected to database");

}
	);
http.listen(config.port,function(err){

if(err){
	console.log(err);
}
else
	console.log("Listening at 8888");

});
*/

var mongo =require('mongodb').MongoClient,
client = require('socket.io').listen(3000).sockets;
mongo.connect('mongodb://127.0.0.1/chat',function(err,db){
if(err) throw err;


client.on('connection',function(socket){

var col = db.collection('messages'),
sendStatus = function(s){
    socket.emit('status',s);
};
col.find().limit(100).sort({id: 1}).toArray(function(err,res){
if(err) throw err;
socket.emit('output',res);
});

//console.log("Someone has connected");

socket.on('input',function(data){
	//console.log(data);
    var name=data.name,
    message = data.message;
    whitespacePattern =/^\s*$/; 

    if(whitespacePattern.test(name) || whitespacePattern.test(message))
     {
      sendStatus('Name and message is required');
   // console.log("Invalid");}

else{
    //7080198881


    col.insert({name: name, message:message},function(){
    	//console.log("Inserted");
        client.emit('output',[data]);
     sendStatus({
    message:"Message Sent",
    clear: true;

     });


    });
}
}) ;
});

});