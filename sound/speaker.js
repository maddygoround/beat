"use strict";

const Speaker = require("speaker");

const args = process.argv.splice(2);
const format = JSON.parse(args[0]);
const speaker = new Speaker(format);

speaker.on("close", () => process.exit(0));
process.stdin.pipe(speaker);
