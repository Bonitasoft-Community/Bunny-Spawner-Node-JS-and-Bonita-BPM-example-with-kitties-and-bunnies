function Cat(game, x, y) {
	this.game = game;
	this.tileSize = 32;
	this.x = parseInt(x);
	this.y = parseInt(y);
	this.dx = 0;
	this.dy = 0;
	
	this.tile = new Tileset(this.game.ressources.images["cat"], this.tileSize);
	
	this.etatAnimation = 0;
	this.frame = 0;

	this.count = 0;
	this.direction = 0;
	this.color = Math.floor((Math.random() * 4) + 1) - 1;
}

Cat.prototype.affiche = function(context) {
	this.randomMove();
	this.calculFrame();
	this.move();
	var tileToShow = this.color * 12 + this.direction * 3 + this.frame;
	this.tile.dessinerTile(tileToShow, context, this.x - (this.tileSize / 2), this.y - this.tileSize)
}

Cat.prototype.move = function() {
	if (this.etatAnimation > 20) {
		if (this.direction == 0) {
			this.y += 1;
		} else if (this.direction == 1) {
			this.x -= 1;
		} else if (this.direction == 2) {
			this.y -= 1;
		} else if (this.direction == 3) {
			this.x += 1;
		}
	}
}

Cat.prototype.calculFrame = function() {
	this.etatAnimation++;
	if (this.etatAnimation < 20) {
		this.frame = 0;
	} else if (this.etatAnimation < 30) {
		this.frame = 1;
	} else if (this.etatAnimation < 40) {
		this.frame = 2;
	} else if (this.etatAnimation < 50) {
		this.frame = 1;
	} else if (this.etatAnimation < 60) {
		this.frame = 2;
	} else {
		this.etatAnimation = 0;
	}
}

Cat.prototype.randomMove = function() {
	this.count++;
	if (this.count >= 60) {
		this.direction = Math.floor((Math.random() * 4) + 1) - 1; 
		this.count = 0;
	}
}