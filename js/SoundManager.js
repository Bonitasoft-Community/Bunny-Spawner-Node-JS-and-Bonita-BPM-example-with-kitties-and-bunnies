function SoundManager(game) {
	this.game = game;
	this.sounds = {};
}

SoundManager.prototype.addSound = function(sound) {
	this.sounds[sound] = new Audio(this.game.ressources.sonsSources[sound]);
	this.sounds[sound].volume = .3;
}

SoundManager.prototype.playOnce = function(sound) {
	this.sounds[sound].play();
}

SoundManager.prototype.playLoop = function(sound) {
	this.sounds[sound].addEventListener('ended', function() {
		this.currentTime = 0;
		this.play();
	}, false);
	this.sounds[sound].play();
}

SoundManager.prototype.stopLoop = function(sound) {
	this.sounds[sound].pause();
	this.sounds[sound].currentTime = 0;
}