const React = require("react");
const PropTypes = require("prop-types");
const blacklist = require("blacklist");
const { Text , Box} = require("ink");

const BLACKLIST_PROPS = [
	"percent",
	"left",
	"right",
	"columns",
	"character",
	"rightPad",
];

const Bar = (props) => {
	const getString = () => {
		const { percent, columns, left, right, character, rightPad } = props;
		const screen = columns || process.stdout.columns || 80;
		const space = screen - right - left;
		const max = Math.min(Math.floor(space * percent), space);
		const chars = character.repeat(max);

		if (!rightPad) {
			return chars;
		}

		return chars + " ".repeat(space - max);
	};

	const newprops = blacklist(props, BLACKLIST_PROPS);
	return (

			<Text {...newprops}>{getString()}</Text>

	);
};

Bar.defaultProps = {
	columns: 0,
	percent: 1,
	left: 0,
	right: 0,
	character: "█",
	rightPad: false,
};

Bar.propTypes = {
	columns: PropTypes.number,
	percent: PropTypes.number,
	left: PropTypes.number,
	right: PropTypes.number,
	character: PropTypes.string,
	rightPad: PropTypes.bool,
};

module.exports = Bar;
