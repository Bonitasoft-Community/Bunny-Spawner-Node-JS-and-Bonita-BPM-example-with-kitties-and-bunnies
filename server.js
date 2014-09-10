var http = require('http');
var io  = require('socket.io');
var fs = require('fs');
var url = require("url");
var path = require('path');
var mime = require('mime');
var unirest = require('unirest');

//rest needs
var remoteBonitaHost = "http://localhost:8080/bonita";
var Client = require('node-rest-client').Client;
var client = new Client();

// registering remote methods
client.registerMethod("login", remoteBonitaHost + "/loginservice", "POST");
client.registerMethod("logout", remoteBonitaHost + "/logoutservice", "GET");
client.registerMethod("postMethod", remoteBonitaHost, "POST");
client.registerMethod("getProcess", remoteBonitaHost + "/API/bpm/process?p=0&c=10", "GET");
// rest needs /\/

var threadBonita = http.createServer(handlerBonita);
var threadClient = http.createServer(handlerClient);

var toClient = io.listen(threadClient);

threadBonita.listen(3442);
threadClient.listen(8042);


var log = console.log;

function handlerBonita(req, res) {
	console.log("listening bonita");
	var msg = url.parse(req.url).query;
	console.log(msg);
	if (msg != null) {
		var param = msg.split("&");
		for (var i in param) {
			var keyval = param[i].split("=");
			toClient.emit('update', { type: keyval[0], val: keyval[1] });
			console.log("socket emit " + keyval[0] + "=" + keyval[1]);
		}
	}
	console.log("message send to client");
	res.writeHead(200, {'Content-Type': 'text/plain'});
	res.end("hello");
}

function handlerClient(req, res) {
    var dir = "";
    var uri = url.parse(req.url).pathname;
    if (uri == "/") {
        uri = "/index.html";
    }
    var filename = path.join(dir, uri);
    log(filename);
	//log(mime.lookup(filename));
    fs.readFile(__dirname + filename,
        function (err, data) {
            if (err) {
                res.writeHead(500);
                return res.end(err + 'Error loading index.html');
            }
            //log(data);
            //log(filename + " was read");
            res.setHeader('content-type', mime.lookup(filename));
            res.writeHead(200);
            res.end(data);
        });
}

var bunny = 0;
var cat = 0;

toClient.on('connection', function (socket) {
	console.log("client connected ---------------------------------------------------------------------------------");
	socket.on('update', function(data) {
		if (data.varName == "bunny")
			bunny += data.value;
		if (data.varName == "cat")
			cat += data.value;
		socket.broadcast.emit('update', {type: data.varName, val: data.value});
	});
	socket.on('resetServer', function(data) {
		console.log("reset");
		modValue('bunny', 0);
		modValue('cat', 0);
		socket.broadcast.emit('resetClient');
	});
	
	setInterval(function() {
		if(bunny > 0) {
			addValue('bunny', bunny);
			bunny = 0;
		}
		if (cat > 0) {
			addValue('cat', cat);
			cat = 0;
		}
	}, 1000);
});

function addValue(vari, newValue) {
	connectThen(function(logout) {
			unirest.get(remoteBonitaHost + "/API/bpm/case?p=0&c=10&s=bunny")
				.headers({
					'Accept': 'application/json'
				})
				.jar(true)
				.end(function(response) {
					console.log("Bonita Game case ID request");
					console.log(response.body);
					var processId = response.body[0].id;
					unirest.get(remoteBonitaHost + "/API/bpm/caseVariable/"+processId+"/"+vari)
						.headers({
							'Accept': 'application/json'
						})
						.jar(true)
						.end(function(response) {
							console.log("request for " + vari);
							console.log(response.body);
							var value = parseInt(response.body.value) + parseInt(newValue);
							unirest.put(remoteBonitaHost + "/API/bpm/caseVariable/"+processId+"/"+vari)
								.headers({
									'Accept': 'application/json'
								})
								.send("[{\"type\":\"java.lang.Integer\",\"value\":"+value+"}]")
								.jar(true)
								.end(function(response) {
									console.log("request for change " + vari + " with value " + value);
									console.log(response.body);
									logout();
								});
						});
				});
		});
}

function modValue(vari, newValue) {
	connectThen(function(logout) {
		unirest.get(remoteBonitaHost + "/API/bpm/case?p=0&c=10&s=bunny")
			.headers({
				'Accept': 'application/json'
			})
			.jar(true)
			.end(function(response) {
				console.log("Bonita Game case ID request");
				console.log(response.body);
				var processId = response.body[0].id;
				var value = parseInt(newValue);
				unirest.put(remoteBonitaHost + "/API/bpm/caseVariable/"+processId+"/"+vari)
					.headers({
						'Accept': 'application/json'
					})
					.send("[{\"type\":\"java.lang.Integer\",\"value\":"+value+"}]")
					.jar(true)
					.end(function(response) {
						console.log("request for change " + vari + " with value " + value);
						console.log(response.body);
						logout();
					});
			});
	});
}

function connectThen(callback) {
	unirest.post(remoteBonitaHost + "/loginservice?redirect=false&username=admin&password=bpm")
		.headers({
			'Accept': 'application/json'
		})
		.jar(true)
		.end(function(response) {
			console.log(response.body);
			callback(function() {
				unirest.get(remoteBonitaHost + "/logoutservice")
					.headers({
						'Accept': 'application/json'
					})
					.jar(true)
					.end(function() {
						console.log("disconnect from rest API");
					});
			});
		});
}