function Tileset(image, size) {
	// Chargement de l'image dans l'attribut image
	this.tileSize = size;
	this.image = image;
	this.image.referenceDuTileset = this;
	this.largeur = this.image.width / this.tileSize;
}

// Méthode de dessin du tile numéro "numero" dans le contexte 2D "context" aux coordonnées x et y
Tileset.prototype.dessinerTile = function(numero, context, xDestination, yDestination) {
	var xSourceEnTiles = numero % this.largeur;
	//if(xSourceEnTiles == 0) xSourceEnTiles = this.largeur;
	var ySourceEnTiles = Math.floor(numero / this.largeur);
	var xSource = (xSourceEnTiles) * this.tileSize;
	var ySource = (ySourceEnTiles) * this.tileSize;
	
	context.drawImage(this.image, xSource, ySource, this.tileSize, this.tileSize, xDestination, yDestination, this.tileSize, this.tileSize);
}
