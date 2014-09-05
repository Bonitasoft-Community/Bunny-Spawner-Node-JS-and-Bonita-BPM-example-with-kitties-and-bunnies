
window.onload = function() {
	var game = new Game("game");
	game.init(
		function() {
			console.log("init end");
			game.run();
		}
	);
}

function Game(divId) {
	this.socket;
	this.mainDiv = document.getElementById(divId);
	this.map;
	this.ressources = {};
	this.renderer = new Renderer(this);
	this.canvasloader = new CanvasLoader(this);
	this.handlerLoader = new HandlerLoader(this);
	this.mainCanvas;
	
	/* sources */
	this.ressources.imagesSources = {
		grass:	"ressources/grass.png",
		bunny:	"ressources/bunny.png",
		cat:	"ressources/cat.png"
	};
	
	this.nbBunny = 0;
	this.nbCat = 0;
}

Game.prototype.addBunny = function(x, y) {
	var bunny = new Bunny(this, x, y);
	this.renderer.addObject(bunny);
	this.nbBunny++;
	document.getElementById("bunnyNb").innerHTML = this.nbBunny;
}

Game.prototype.addCat = function(x, y) {
	var cat = new Cat(this, x, y);
	this.renderer.addObject(cat);
	this.nbCat++;
	document.getElementById("catNb").innerHTML = this.nbCat;
}

Game.prototype.init = function(callback) {
	var self = this;
	this.canvasloader.createCanvas(function() {
			self.handlerLoader.load(function() {});
		}
	);
	
	this.loadImage(
		function() {
			self.loadMap();
			callback();
		}
	);
}

Game.prototype.loadMap = function() {
	var terrain = new Array();
	for (var i = 0; i < 15; i++) {
		var t = new Array();
		for (var j = 0; j < 40; j++) {
			t[j] = 0;
		}
		terrain[i] = t;
	}
	
	this.map = new Map(terrain, "grass", this);
	this.renderer.setMap(this.map);
}

Game.prototype.loadImage = function(callback, counter) {
    var imagesSources = this.ressources.imagesSources;
	var imageToLoad = 0;
	if (!this.ressources.images)
		this.ressources.images = [];
	for (var image in imagesSources) {
		imageToLoad++;
		console.log(image);
		var src = imagesSources[image];
		var img = new Image();
		this.ressources.images[image] = img;
		img.onload = function() {
			imageToLoad--;
			console.log("image to load: " + imageToLoad);
			if (imageToLoad == 0) {
				callback();
			}
		}
		img.onerror = function(e) {
			console.error("Image " + image + " failed to load (" + e.originalTarget.src + ")");
		}
		img.src = imagesSources[image];
	}
}

Game.prototype.run = function() {
	var self = this;
	this.socket = io.connect('http://localhost:8042');
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
	
	this.canvasloader.setSize();
	var self = this;
	setInterval(function() {
		self.renderer.render(self.mainCtx, self.objectCtx);
	}, 40);
	
	
}