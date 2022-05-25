const fs = require("fs");
const lame = require("@suldashi/lame");
const util = require("util");
const EventEmitter = require("events").EventEmitter;
const Speaker = require("speaker");
const decoder = new lame.Decoder();
var speaker;

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
	if (!this.autoplay) {
		setTimeout(() => {
			// console.log(this.file);
			const stream = fs.createReadStream(this.file);
			const decoder = new lame.Decoder();
			const that = this;
			stream.pipe(decoder).on("format", function (format) {
				speaker = new Speaker(format);
				this.pipe(speaker);
				that.spkr = speaker;
				that.spkr.on("error", () => {});
				that.spkr.on("warn", () => {});
			});
			this.stream = stream;
			this.decoder = decoder;
			this.running = true;
			this.emit("play");
		}, 500);
	}
};

CliPlayer.prototype.pause = function () {
	if (!this.paused && this.running) {
		var that = this;
		setTimeout(function () {
			that.spkr.close();
			that.paused = true;
			that.emit("pause");
		}, 500);
	}
};

CliPlayer.prototype.resume = function () {
	if (this.paused && this.running) {
		var that = this;
		setTimeout(function () {
			that.spkr = new Speaker();
			that.spkr.on("error", () => {});
			that.spkr.on("warn", () => {});
			that.decoder.pipe(that.spkr);
			that.paused = false;
			that.emit("resume");
		}, 500);
	}
};

CliPlayer.prototype.stop = function () {
	this.manualStop = true;
	this.running = false;
	var that = this;
	setTimeout(function () {
		if (that.spkr) {
			that.spkr.close();
			that.decoder.unpipe();
			that.stream.close();
			that.stream = null;
			that.spkr = null;
			that.decoder = null;
			that.emit("stop");
		}
	}, 500);
};

module.exports = CliPlayer;
