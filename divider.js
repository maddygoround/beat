const React = require("react");
const { Box, Text, Spacer } = require("ink");
const stringWidth = require("string-width");

const PAD = " ";

// Divider
const Divider = ({
	title,
	width,
	padding,
	titlePadding,
	titleColor,
	dividerChar,
	dividerColor,
    moveInterval,
    file
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
    },[])

	React.useEffect(() => {
		const dividerWidth =  getSideDividerWidth(width, titleWidth);

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
	}, []);

	React.useEffect(() => {
		if (startIndexing && shiftIndex > -25 && moveInterval) {
			setTimeout(() => {
				setShiftIndex(shiftIndex - 1);
			}, moveInterval);
		}
	}, [shiftIndex, moveInterval]);

	const dividerSideStringLeft = dividerChar.repeat(
		numberOfCharsPerSide - shiftIndex
	);

	const dividerSideStringRight = dividerChar.repeat(
		numberOfCharsPerSide + shiftIndex
	);

	return (
		<Box flexDirection="row">
			<Text>{file.title}</Text>
			<Text>{file.artist}</Text>
			<Text>00:00:00</Text>
			<Text>{paddingString}</Text>
			<Text color={dividerColor}>{dividerSideStringLeft}</Text>
			<Text color={titleColor}>{titleString}</Text>
			<Text color={dividerColor}>{dividerSideStringRight}</Text>
			<Text>{paddingString}</Text>
			<Text>{dateFormatter(file.duration)}</Text>
		</Box>
	);
};

module.exports = Divider;
