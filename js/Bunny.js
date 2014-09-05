function Bunny(game, x, y) {
	this.game = game;
	this.tileSize = 32;
	this.x = parseInt(x);
	this.y = parseInt(y);
	this.dx = 0;
	this.dy = 0;
	
	this.tile = new Tileset(this.game.ressources.images["bunny"], this.tileSize);
	
	this.etatAnimation = 0;
	this.frame = 0;

	this.count = 0;
	this.direction = 0;
}

Bunny.prototype.affiche = function(context) {
	this.randomMove();
	this.calculFrame();
	this.move();
	var tileToShow = this.direction * 2 + this.frame;	
	this.tile.dessinerTile(tileToShow, context, this.x - (this.tileSize / 2), this.y - this.tileSize)
}

Bunny.prototype.move = function() {
	if (this.etatAnimation == 37) {
		if (this.direction == 0) {
			this.y += 8;
		} else if (this.direction == 1) {
			this.x -= 8;
		} else if (this.direction == 2) {
			this.y -= 8;
		} else if (this.direction == 3) {
			this.x += 8;
		}
	} else if (this.etatAnimation == 40) {
		if (this.direction == 0) {
			this.y += 8;
		} else if (this.direction == 1) {
			this.x -= 8;
		} else if (this.direction == 2) {
			this.y -= 8;
		} else if (this.direction == 3) {
			this.x += 8;
		}
	}
}

Bunny.prototype.calculFrame = function() {
	this.etatAnimation++;
	if (this.etatAnimation < 35) {
		this.frame = 0;
	} else if (this.etatAnimation < 40) {
		this.frame = 1;
	} else if (this.etatAnimation < 45) {
		this.frame = 0;
	} else {
		this.etatAnimation = 0;
	}
}

Bunny.prototype.randomMove = function() {
	this.count++;
	if (this.count >= 60) {
		this.direction = Math.floor((Math.random() * 4) + 1) - 1; 
		this.count = 0;
	}
}