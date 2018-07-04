var net = require('net');
const express = require('express');

// Configuration parameters
var HOST = '192.168.15.7';
var PORT = 1234;

function singleton (onClientConnected) {
	// Create Server instance
	var server = net.createServer(onClientConnected);
    return server;
}

module.exports.singleton = singleton;