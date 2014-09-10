Bunny-Spawner, a Node.JS and Bonita BPM example with kitties and bunnies
==========================================

This is an example of how to use the Bonita BPM web REST API with Node.js. To make it fun and adorable for your girl friend, we used some good old 8bit like sprites with cats and rabbits ;-) lol

# Prerequisite

* node.js
 * npm Package socket.io
 * npm Package unirest
* Bonita BPM Community 6.3.1 on localhost:8080
 * added user "admin" with password "bpm"
 * intalled process bunny-1.0.bar
 
# how to use

* start the bunny process on the Bonita server, via the Portal
* start the node server by typing: `node server.js`
* start Internet explorer Nooo.. please don't. Start Firefox or Chrome instead.
 * Go on localhost:8042
 * have fun ! right click for kitties and left click for bunnies.
 
# how it works

it a three parts system,

* Browser js client
* Node js server
* Bonita BPM

The browser client and the Node.js server communicate throught socket with Socket.io.
The Node.js server call the Bonita REST API with Unirest.
And Bonita call the Node.js server via HTTP requests.

## Browser js client TO Node.js server

the following code allow the client to send notification to the server (line 107: game.js & line 19/24: handlerLoader.js)):
```
socket = io.connect(document.URL);
socket.emit('update', {varName: 'bunny', value: 1});
socket.emit('update', {varName: 'cat', value: 1});
```

this code receive the notification on server side  (line 77: server.js):
```
	socket.on('update', function(data) {
		if (data.varName == "bunny")
			bunny += data.value;
		if (data.varName == "cat")
			cat += data.value;
	...
```

## Node.js server TO Browser js client

the following code allow the server to send notification to clients  (line 40: server.js):
```
toClient.emit('update', { type: keyval[0], val: keyval[1] });
```
this code receive the notification on client side and add at a random position a bunny or a kitty (line 108: game.js):
```
this.socket.on('update', function(data) {
	console.log("update received");
	console.log(data.type + ", " + data.val)
	switch(data.type) {
		case "bunny":
			var x = Math.floor((Math.random() * 1200) + 40);
			var y = Math.floor((Math.random() * 400) + 40);
			self.addBunny(x, y);
			break;
		case "cat":
			var x = Math.floor((Math.random() * 1200) + 40);
			var y = Math.floor((Math.random() * 400) + 40);
			self.addCat(x, y);
			break;
		default:
			break;
	}
});
```

## Node.js server TO Bonita BPM

This connection use the package unirest for Node.js, for more information follow the link to
[Unirest](https://github.com/Mashape/unirest-nodejs).
To use Bonita REST API you need to be connected so there is this fonction which allows to connect
then do your call and finally disconnect (line 166: server.js):
```
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
``` 

Then, three nested request are called throught the function modValue (line 103: server.js),

* Get the process instance
* Get value of the requested variable
* Put the new value for the variable


```
function modValue(vari, newValue) {
	connectThen(function(logout) {
		>	unirest.get(remoteBonitaHost + "/API/bpm/case?p=0&c=10&s=bunny")
				.headers({
					'Accept': 'application/json'
				})
				.jar(true)
				.end(function(response) {
					console.log("Bonita Game case ID request");
					console.log(response.body);
					var processId = response.body[0].id;
		>			unirest.get(remoteBonitaHost + "/API/bpm/caseVariable/"+processId+"/"+vari)
						.headers({
							'Accept': 'application/json'
						})
						.jar(true)
						.end(function(response) {
							console.log("request for " + vari);
							console.log(response.body);
							var value = parseInt(response.body.value) + parseInt(newValue);
		>					unirest.put(remoteBonitaHost + "/API/bpm/caseVariable/"+processId+"/"+vari)
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
```
**NOTE: you need to send: "[{\"type\":\"java.lang.Integer\",\"value\":"+value+"}]" to change the
value in order to make it work.**

## Bonita BPM TO Node.js server

The comunication is done by a simple HTTP request in a custom connector on a bunny process step.
it's made throught the following code:
```
	@Override
	protected void executeBusinessLogic() throws ConnectorException {
		boolean update = false;
		String request = getUrl() + "?";
		int bunny = getBunnyNb();
		int cat = getCatNb();
		int i;
		Random r = new Random();
		
		if (bunny > 5) {
			update = true;
			bunny++;
			request += "bunny=1";
		}
		
		if (cat > 2) {
			i = r.nextInt(100 - cat);
			if (i <= 5) {
				if (update)
					request += "&";
				update = true;
				cat++;
				request += "cat=1";
			}
		}
		
		if (update) {
			try {
		>		URL url = new URL(request);
		>		InputStream is = url.openStream();
		>		is.close();
			} catch (Exception e) {
				e.printStackTrace();
			}
		}
		setNewBunnyNb(bunny);
		setNewCatNb(cat);
```
