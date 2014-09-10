function HandlerLoader(game) {
	this.game = game;
}

HandlerLoader.prototype.load = function(callback) {
	this.loadMouse();
	callback();
}

HandlerLoader.prototype.loadMouse = function() {
	// add action on left click
	var game = this.game;
	this.game.mainCanvas.onmousedown = function(event) {
		if (event.button != 2) {
			var left = game.mainCanvas.offsetLeft;
			var top = game.mainCanvas.offsetTop;
			game.addBunny(event.clientX - left, event.clientY - top);
			game.socket.emit('update', {varName: 'bunny', value: 1});
		} else {
			var left = game.mainCanvas.offsetLeft;
			var top = game.mainCanvas.offsetTop;
			game.addCat(event.clientX - left, event.clientY - top);
			game.socket.emit('update', {varName: 'cat', value: 1});
		}
	}
	
	// add action on right click
	this.game.mainCanvas.oncontextmenu = function(event) {
		return false;
	}
	
	document.getElementById("reset").onmousedown = function(event) {
		game.renderer.clean();
		game.socket.emit('resetServer');
	}
}