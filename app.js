var net = require('net');
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
JsonSocket = require('json-socket');

let LançamentoSchema = new Schema({
  nomeComprador: { type: String, required: true },
  nomeProduto: { type: String, required: true },
  valor: { type: Number }
}, { runSettersOnQuery: true });

let Lançamento = mongoose.model('Lançamento', LançamentoSchema);
// Configuration parameters
var HOST = '192.168.15.7';
var PORT = 1234;

// Create Server instance
var server = net.createServer(onClientConnected);


var MongoClient = require('mongodb').MongoClient;
//Create a database named "mydb":
var url = "mongodb://localhost:27017/mydb";

MongoClient.connect(url, function(err, db) {
  if (err) throw err;
  console.log("Connected");

  db.close();
});

server.listen(PORT, HOST, function () {
  console.log('server listening on %j', server.address());
});





function onClientConnected(sock) {
  var remoteAddress = sock.remoteAddress + ':' + sock.remotePort;
  console.log('new client connected: %s', remoteAddress);

  sock.on('data', function(data) {
    console.log('%s Says: %s', remoteAddress, data);
    sock.write(data);
    sock.write(' exit');
    // socket json
    socket = new JsonSocket(sock);
    var objString = String(data); //o data vem do client com um #63 na frente, tive que trocar para string, remover os 3 chars e mudar pra json de novo, senao nao funcionava
    objString = objString.substring(3);
    var obj = JSON.parse(objString)
    MongoClient.connect(url, function(err, db){
      if(err) throw err;
      var dbo = db.db("mydb");
      //salva lancamento
      dbo.collection("lancamentos").insertOne(obj, function(err, res) {
        if(err) throw err;
        console.log("1 document inserted");
        db.close();
      });
      //busca todos os lancamentos
      dbo.collection("lancamentos").find({}).toArray(function(err, result) {
        if (err) throw err;
        console.log(result);
        db.close();
      })
    });
    console.log(data);
	//manda json do server para o cliente
	socket.sendEndMessage({result: 2});
  });
  sock.on('close',  function () {
    console.log('connection from %s closed', remoteAddress);
  });
  sock.on('error', function (err) {
    console.log('Connection %s error: %s', remoteAddress, err.message);
  });
};
