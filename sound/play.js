var fs = require("fs"),
	findExec = require("find-exec"),
	spawn = require("child_process").spawn,
	events = require('events'),
	players = [
		"mplayer",
		"afplay",
		"mpg123",
		"mpg321",
		"play",
		"omxplayer",
		"aplay",
		"cmdmp3",
		"cvlc",
		"powershell",
	];

function Play(opts) {
	opts = opts || {};
	events.EventEmitter.call(this);
	this.players = opts.players || players;
	this.player = opts.player || findExec(this.players);
	this.urlRegex = /^(https?|ftp):\/\/[^\s\/$.?#].[^\s]*$/i;
	// Regex by @stephenhay from https://mathiasbynens.be/demo/url-regex

	this.play = function (what, options, next) {
		this.stopped = false;
		if (typeof this.process !== "undefined") this.process.kill("SIGTERM"); 
		next = next || function () {};
		next = typeof options === "function" ? options : next;
		options = typeof options === "object" ? options : {};
		options.stdio = "ignore";

		var isURL = this.player == "mplayer" && this.urlRegex.test(what);

		if (!what) return next(new Error("No audio file specified"));

		if (!this.player) {
			return next(new Error("Couldn't find a suitable audio player"));
		}

		var args = Array.isArray(options[this.player])
			? options[this.player].concat(what)
			: [what];

		this.process = spawn(this.player, args, options);

		if (!this.process) {
			next(new Error("Unable to spawn process with " + this.player));
			return null;
		}

		this.process.on("close", function (err) {
			// next(err && !err.killed ? err : null);
			// self.emit("complete");
		});

		var self = this;

		this.process.on("exit", function (code, sig) {
			self.stopped = true;
			if (code !== null && sig === null) {
				// self.emit("complete");
			}
		});

		return this;
	};

	this.pause = () => {
		if (this.process) {
			if (this.stopped) return true;
			this.process.kill("SIGTSTP");
			// this.emit("pause");
		}
	};

	this.resume = () => {
		if (this.process) {
			if (this.stopped) return this.play();
			this.process.kill("SIGCONT");
			// this.emit("resume");
		}
	};

	this.stop = () =>{
		if(this.process){
			this.stopped = true;
			this.process.kill("SIGTERM");
			// this.emit("stop");
		}
	}

	this.test = function (next) {
		this.play("./assets/test.mp3", next);
	};
}

module.exports = function (opts) {
	return new Play(opts);
};
