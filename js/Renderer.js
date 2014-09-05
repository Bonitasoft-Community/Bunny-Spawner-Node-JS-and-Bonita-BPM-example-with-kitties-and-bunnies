function Renderer(game) {
	this.map;
	this.objectsToRender = new Array();
}

Renderer.prototype.render = function(mainContext, objectContext) {	
	this.map.affiche(mainContext);
	
	/* sort by y position value (null are put at the end) */
	this.objectsToRender.sort(function(a, b) {
		if (a == null)
			return 1;
		if (b == null)
			return -1;
		return a.y - b.y;
	});
	
	/* render image order and then slice the array to suppress deleted object (null object) */
	for (var nb in this.objectsToRender) {
		var obj = this.objectsToRender[nb];
		if (obj == null) {
			this.objectsToRender = this.objectsToRender.slice(0,nb);
			break;
		}
		obj.affiche(mainContext);
	}
}

/* use as a callback (using global rpg var) */
Renderer.prototype.delImage = function(obj) {
	index = rpg.renderer.objectsToRender.indexOf(obj);
	rpg.renderer.objectsToRender[index] = null;
}

Renderer.prototype.addObject = function(obj) {
	this.objectsToRender.push(obj)
}

Renderer.prototype.setMap = function(map) {
	this.map = map;
}

Renderer.prototype.setSize = function() {
	for (var nb in this.objectsToRender) {
		var obj = this.objectsToRender[nb];
		obj.setSize();
	}
}

Renderer.prototype.setLoadingScreen = function(loadingScreen) {
	this.loadingScreen = loadingScreen;
}

Renderer.prototype.clean = function() {
	this.objectsToRender = new Array();
}