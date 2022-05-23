const React = require("react");
const { Box, Text, Spacer, Newline } = require("ink");
const Gradient = require("ink-gradient");
const stringWidth = require("string-width");
const BigText = require("ink-big-text");

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

	const filterVals = ["title","album","year","artist"];
	if (file) {
		return (
			<Box flexDirection="column" width="100%">
				<Box  marginLeft={2}>
					<Text italic color="blueBright">Song Info</Text>
				</Box>
				<Box
					flexDirection="column"
					borderStyle="single"
					paddingTop={2}
					paddingLeft={2}
					height={30}
					borderColor="#7b4397"
					alignSelf="center"
					justifyContent="flex-start"
					width="95%"
				>
					{Object.keys(file)
						.filter((v) => filterVals.indexOf(v) >= 0)
						.map((key) => {
							return (
								<Box flexDirection="row">
									<Box width={10}>
										<Text italic bold color="#2c3e50">
											{key.charAt(0).toUpperCase() + key.slice(1)}:{" "}
										</Text>
									</Box>
									<Text>{file[key]}</Text>
									<Newline />
								</Box>
							);
						})}

					<Box flexDirection="row">
						<Box width={10}>
							<Text italic bold color="#2c3e50">
								Album:{" "}
							</Text>
						</Box>
						<Text>{file.album || "N/A"}</Text>
						<Newline />
					</Box>

					<Box flexDirection="row">
						<Box width={10}>
							<Text bold color="#2c3e50" italic>
								Genre:{" "}
							</Text>
						</Box>
						<Text>{file.genre.length ? file.genre.join(",") : "N/A"}</Text>
						<Newline />
					</Box>

					<Box flexDirection="row">
						<Box width={10}>
							<Text bold color="#2c3e50" italic>
								Duration:{" "}
							</Text>
						</Box>
						<Text>{dateFormatter(file.duration)}</Text>
						<Newline />
					</Box>
				</Box>
				<Box
					paddingTop={2}
					paddingLeft={2}
					alignSelf="center"
					alignItems="center"
					justifyContent="center"
					height={20}
				>
					<Gradient name="rainbow">
						<BigText text="Beat" lineHeight={2} maxLength={4}></BigText>
					</Gradient>
				</Box>
				<Box
					paddingLeft={2}
					flexDirection="row"
					borderStyle="single"
					alignSelf="center"
					height={3}
					width="95%"
					justifyContent="center"
					borderColor="#eecda3"
				>
					<Text>00:00:00</Text>
					<Text>{paddingString}</Text>
					<Gradient name="rainbow">
						<Text color={dividerColor}>{dividerSideStringLeft}</Text>
						<Text color={titleColor}>{titleString}</Text>
						<Text color={dividerColor}>{dividerSideStringRight}</Text>
						<Text>{paddingString}</Text>
					</Gradient>
					<Text>{dateFormatter(file.duration)}</Text>
				</Box>
				<Box
					paddingLeft={2}
					flexDirection="row"
					borderStyle="single"
					alignSelf="center"
					height={3}
					// marginLeft={2}
					width="95%"
					justifyContent="center"
					borderColor="#eecda3"
				>
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
		return <Box flexDirection="row"></Box>;
	}
};

module.exports = Info;
