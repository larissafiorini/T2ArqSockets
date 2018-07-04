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
//var server = net.createServer(onClientConnected);
var serv = require('./singleton');
var lancamentoCadastro = require('./lancamentoCadastro');
var lancamentoBuscar = require('./lancamentoBuscar');
var produtoBuscar = require('./produtoBuscar');
var produtoCadastro = require('./produtoCadastro');

var server = serv.singleton(onClientConnected);
//console.log(onClientConnected);

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

  // MongoClient.connect(url, function(err, db){
  //   if(err) throw err;
  //   var dbo = db.db("mydb");
  //   var produto ={
  //   "anunciante": "John Doe",
  //   "produto": "Gameboy",
  //   "valorInicial": 200
  //   };
  //   dbo.collection("produtos").insertOne(produto, function(err, res) {
  //     if(err) throw err;
  //     db.close();
  //   });
  //   dbo.collection("produtos").find({}).toArray(function(err, result) {
  //     if (err) throw err;
  //     console.log(result);
  //     socket.sendEndMessage(result);
  //     db.close();
  //   })
  // });

  sock.on('data', function(data) {
    console.log('%s Says: %s', remoteAddress, data);
    //sock.write(data);
    //sock.write(' exit');
    // socket json
    socket = new JsonSocket(sock);
    var objString = String(data); //o data vem do client com um #63 na frente, tive que trocar para string, remover os 3 chars e mudar pra json de novo, senao nao funcionava
    objString = objString.substring(3);
    var obj = JSON.parse(objString)
    MongoClient.connect(url, function(err, db) {
      if(err) throw err;
      var dbo = db.db("mydb");
//      dbo.dropDatabase();
      if (objString.includes("nomeProduto")) {
        lancamentoCadastro.lancamentoCadastro(db, obj);
        //busca todos os lancamentos
        lancamentoBuscar.lancamentoBuscar(db, socket);
      }
      else if(objString.includes("produto")){
        produtoBuscar.produtoCadastro(db, obj);
        produtoBuscar.produtoBuscar(db, socket);
      }
      else {
        produtoBuscar.produtoBuscar(db, socket);
      }
      //salva lancamento

    });

      // var produto = {
      //   "anunciante": "John Doe",
      //   "produto": "Gameboy",
      //   "valorInicial": 200
      //   };
      //   dbo.collection("produtos").insertOne(produto, function(err, res) {
      //     if(err) throw err;
      //     db.close();
      //   });
      //   dbo.collection("produtos").find({}).toArray(function(err, result) {
      //     if (err) throw err;
      //     console.log(result);
      //     socket.sendEndMessage(result);
      //     db.close();
      //   });
      // });
    console.log(data);


  });

  sock.on('close',  function () {
    console.log('connection from %s closed', remoteAddress);
  });
  sock.on('error', function (err) {
    console.log('Connection %s error: %s', remoteAddress, err.message);
  });
};
