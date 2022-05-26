const fs = require("fs");
const lame = require("@suldashi/lame");
const EventEmitter = require("events").EventEmitter;
const Speaker = require("./instance");

class CliPlayer extends EventEmitter {
	constructor(file, opts) {
		super();
		this.opts = opts || { autoplay: false };
		this.file = file;
		if (this.opts.autoplay) {
			this.play();
		}
	}
}

CliPlayer.prototype.paused = false;
CliPlayer.prototype.running = false;

CliPlayer.prototype.play = function () {
	if (!this.autoplay && !this.running) {
		setTimeout(() => {
			const stream = fs.createReadStream(this.file);
			const decoder = new lame.Decoder();
			const that = this;
			stream.pipe(decoder).on("format", function (format) {
				const speaker = Speaker(format);
				this.pipe(speaker);
				that.spkr = speaker;
				that.format = format;
			});
			this.stream = stream;
			this.decoder = decoder;
			this.running = true;
			this.emit("play");
		}, 400);
	}
};

CliPlayer.prototype.pause = function () {
	if (!this.paused && this.running) {
		setTimeout(
			function () {
				this.spkr.end();
				this.paused = true;
				this.emit("pause");
			}.bind(this),
			200
		);
	}
};

CliPlayer.prototype.resume = function () {
	if (this.paused && this.running) {
		setTimeout(
			function () {
				this.spkr = Speaker(this.format);
				this.decoder.pipe(this.spkr);
				this.paused = false;
				this.emit("resume");
			}.bind(this),
			200
		);
	}
};

CliPlayer.prototype.stop = function () {
	return new Promise((resolve, reject) => {
		this.running = false;
		setTimeout(
			function () {
				if (this.spkr) {
					this.spkr.end();
					this.decoder.unpipe();
					this.stream.close();
					this.emit("stop");
					resolve();
				} else {
					this.emit("stop");
					resolve();
				}
			}.bind(this),
			200
		);
	});
};

module.exports = CliPlayer;
