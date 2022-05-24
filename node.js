// var FFplay = require("./sound/ffplay");
// var player = new FFplay(
// 	__dirname + "/music/Baadal Barse Yasser Desai 128 Kbps.mp3"
// ); // Loads the sound file and automatically starts playing
// // It runs `ffplay` with the options `-nodisp` and `-autoexit` by default

// setTimeout(()=>{
// player.pause();
// },5000);
const fs = require("fs");
const lame = require("@suldashi/lame");
const Speaker = require("speaker");
var stream = fs.createReadStream(__dirname + "/music/Baadal Barse Yasser Desai 128 Kbps.mp3");
var decoder = new lame.Decoder();
var speaker;

let pipe;

stream.pipe(decoder).on("format", function (format) {
	speaker = new Speaker(format);
	this.pipe(speaker);
    pipe = this;
});

(function loop(err, buf) {
	if (err) {
		return cb(err);
	}
	if (!isPlaying) return;

	buf = read(buf);

	if (!buf) {
		pause();
		return;
	}

	//track current time
	how.currentTime += buf.duration;
	play.currentTime = pause.currentTime = how.currentTime;

	speaker(buf, loop);
})();


setTimeout(()=>{
    pipe.pause();
},3000)

setTimeout(() => {
	pipe.resume();
}, 5000);

