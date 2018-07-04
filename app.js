
var net = require('net');
JsonSocket = require('json-socket');
 
var HOST = '192.168.15.7';
var PORT = 1234;
 
var client = new net.Socket();
 
client.connect(PORT, HOST, function() {
    console.log('Client connected to: ' + HOST + ':' + PORT);
    // Write a message to the socket as soon as the client is connected, the server will receive it as message from the client 
    //client.write('Hello World!');
	var socket = new JsonSocket(client);
	socket.sendMessage({command: 'start', beginAt: 10});
});
 
client.on('data', function(data) {    
    console.log('Client received: ' + data);
	
   //  if (data.toString().endsWith('exit')) {
   //    client.destroy();
   // }
});

 
// Add a 'close' event handler for the client socket
client.on('close', function() {
    console.log('Client closed');
});
 
client.on('error', function(err) {
    console.error(err);
});
