function Map(terrain, sprite, game) {
	this.game = game;
	this.tileSizeMap = 32;
	this.tileset = new Tileset(this.game.ressources.images[sprite], this.tileSizeMap);
	this.terrain = terrain;
	
	// Liste des obstacles du terrain
	this.obstacles = new Array();
	
	this.hauteur = this.terrain.length * this.tileSizeMap;
	this.largeur = this.terrain[0].length * this.tileSizeMap;
}

// Pour ajouter une attack/projecile
Map.prototype.addAttack = function(attack) {
	this.attacks.push(attack);
}

Map.prototype.destroyAttack = function(attackToRemove) {
	indexOfAttack = this.attacks.indexOf(attackToRemove);
	this.attacks[indexOfAttack] = null;
}

Map.prototype.affiche = function(context) {
//canvas affichage
	// Dessin de la carte ligne par ligne haut en bas
	for (var i = 0, l = this.terrain.length; i < l; i++) {
		var ligne = this.terrain[i];
		for(var j = 0, k = ligne.length; j < k; j++) {
			this.tileset.dessinerTile(ligne[j], context, j * this.tileSizeMap, i * this.tileSizeMap);
		}
	}
}