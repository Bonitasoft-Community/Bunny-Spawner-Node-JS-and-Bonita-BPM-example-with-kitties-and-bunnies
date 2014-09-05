function CanvasLoader(game) {
	this.game = game;
}

CanvasLoader.prototype.createCanvas = function(callback) {
	var mainCanvas = this.createElem("canvas", "mainCanvas");	
	this.game.mainDiv.appendChild(mainCanvas);
	this.game.mainCanvas = mainCanvas;
	this.game.mainCtx = mainCanvas.getContext("2d");
	console.log("canvas created");
	callback();
}

CanvasLoader.prototype.setSize = function() {
	mainCanvas.width  = this.game.map.largeur;
	mainCanvas.height = this.game.map.hauteur;
}

CanvasLoader.prototype.createElem = function(divName, id) {
	var elem = document.createElement(divName);
	elem.setAttribute("id", id);
	return elem;
}