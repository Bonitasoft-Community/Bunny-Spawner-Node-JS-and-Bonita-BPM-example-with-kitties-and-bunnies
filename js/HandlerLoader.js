function HandlerLoader(game) {
	this.game = game;
	this.code = 0;
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
		game.soundManager.stopLoop("nya");
	}
	
	window.addEventListener('keydown', function(event) {
		var e = event || window.event;
		var key = e.which || e.KeyCode;
		switch(key) {
			case 27:
				game.soundManager.stopLoop("nya");
				break;
			case 37: // left
				if (this.code == 4 || this.code == 6)
					this.code++;
				else
					this.code = 0;
				break;
			case 38: // up
				if (this.code == 0 || this.code == 1)
					this.code++;
				else
					this.code = 1;
				break;
			case 39: // right
				if (this.code == 5 || this.code == 7)
					this.code++;
				else
					this.code = 0;
				break;
			case 40: // down
				if (this.code == 2 || this.code == 3)
					this.code++;
				else
					this.code = 0;
				break;
			case 65: // a
				if (this.code == 9)
					game.soundManager.playOnce("nya");
				else
					this.code = 0;
				break;
			case 66: // b
				if (this.code == 8)
					this.code++;
				else
					this.code = 0;
				break;
			default : 
				this.code = 0;
				return true;
		}
		return false;
	}, false);
}

