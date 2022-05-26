"use strict";

const { spawn } = require("child_process");

module.exports = (format) => {
	const speaker = spawn("node", [
		__dirname + "/speaker.js",
		JSON.stringify(format),
	]);

	// the `node-speaker` module works pretty well, but has a bug in current versions of node which
	// causes the entire process to panic after it has finished speaking. It's a low-level error, so
	// I don't believe there's any way to catch it
	//
	// so instead, we spawn a child node process to call `speaker.js` so it doesn't matter if the
	// process dies. There are other options too, like `sox`, but in my experience on a mac, node-
	// speaker worked well with this approach

    return speaker.stdin;
};
