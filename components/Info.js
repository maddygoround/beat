const React = require("react");
const { Box, Text, Spacer } = require("ink");
const stringWidth = require("string-width");

const PAD = " ";

// Info
const Info = ({
	title,
	width,
	padding,
	titlePadding,
	titleColor,
	dividerChar,
	dividerColor,
	moveInterval,
	file,
}) => {
	const [shiftIndex, setShiftIndex] = React.useState(0);
	const [startIndexing, setStartIndexing] = React.useState(false);
	const [titleString, setTitleString] = React.useState("");
	const [titleWidth, setTitleWidth] = React.useState(0);
	const [numberOfCharsPerSide, setNumberOfCharsPerSide] = React.useState(0);
	const [paddingString, setPaddingString] = React.useState("");
	// const [dividerWidth, setDividerWith] = React.useState(0);
	// Helpers
	const getSideDividerWidth = React.useCallback(
		(width, titleWidth) => (width - titleWidth) / 2,
		[]
	);
	const getNumberOfCharsPerWidth = React.useCallback(
		(char, width) => width / stringWidth(char),
		[]
	);

	const dateFormatter = React.useCallback((data) => {
		return new Date(data * 1000).toUTCString().match(/(\d\d:\d\d:\d\d)/)[0];
	}, []);

	React.useEffect(() => {
		if (file) {
			const dividerWidth = getSideDividerWidth(width, titleWidth);

			setStartIndexing(true);
			setShiftIndex(dividerWidth);

			setTitleString(
				title
					? `${PAD.repeat(titlePadding) + title + PAD.repeat(titlePadding)}`
					: ""
			);
			setTitleWidth(stringWidth(titleString));
			setNumberOfCharsPerSide(
				getNumberOfCharsPerWidth(dividerChar, dividerWidth)
			);
			setPaddingString(PAD.repeat(padding));
		}
	}, [file]);

	React.useEffect(() => {
		if (startIndexing && shiftIndex > -25 && moveInterval) {
			setTimeout(() => {
				setShiftIndex(shiftIndex - 1);
			}, (file.duration / 50) * 1000);
		}
	}, [shiftIndex]);

	const dividerSideStringLeft = dividerChar.repeat(
		numberOfCharsPerSide - shiftIndex
	);

	const dividerSideStringRight = dividerChar.repeat(
		numberOfCharsPerSide + shiftIndex
	);

	if (file) {
		return (
			<Box flexDirection="column">
				<Box flexDirection="column">
					<Text>Title : {file.title}</Text>
					<Spacer />
					<Text>Artist : {file.artist}</Text>
					<Spacer />
					<Text>Album : {file.album || 'N/A'}</Text>
					<Spacer />
					<Text>Release Year : {file.year}</Text>
					<Spacer />
					<Text>Genre : {file.genre.length ? file.genre.join(",") : 'N/A'}</Text>
					<Text>Duration : {dateFormatter(file.duration)}</Text>
				</Box>
				<Box flexDirection="row">
					<Text>00:00:00</Text>
					<Text>{paddingString}</Text>
					<Text color={dividerColor}>{dividerSideStringLeft}</Text>
					<Text color={titleColor}>{titleString}</Text>
					<Text color={dividerColor}>{dividerSideStringRight}</Text>
					<Text>{paddingString}</Text>
					<Text>{dateFormatter(file.duration)}</Text>
				</Box>
			</Box>
		);
	} else {
		return(<Box flexDirection="row"></Box>);
	}
};

module.exports = Info;
