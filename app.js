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
var HOST = '192.168.0.134';
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
    console.log(socket);
  });
  sock.on('close',  function () {
    console.log('connection from %s closed', remoteAddress);
  });
  sock.on('error', function (err) {
    console.log('Connection %s error: %s', remoteAddress, err.message);
  });
};
