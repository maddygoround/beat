const React = require("react");
const { Box, Text, Spacer, Newline } = require("ink");
const importJsx = require("import-jsx");
const Gradient = require("ink-gradient");
const stringWidth = require("string-width");
const BigText = require("ink-big-text");
const Bar = importJsx("./Bar");
const { useClientContext } = importJsx("../context");
const player = require("../sound/cliplayer");
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
	const playbackStates = ["playing", "paused", "resumed", "stopped"];
	const [shiftIndex, setShiftIndex] = React.useState(0);
	const [startIndexing, setStartIndexing] = React.useState(false);
	const [titleString, setTitleString] = React.useState("");
	const [titleWidth, setTitleWidth] = React.useState(0);
	const [numberOfCharsPerSide, setNumberOfCharsPerSide] = React.useState(0);
	const [paddingString, setPaddingString] = React.useState("");
	const { selectedItem, playbackState, updatePlaybackState , playbackVolumeState } =
		useClientContext();
	const audioRef = React.useRef(null);
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
		if (playbackState && audioRef.current) {
			const doNotPerformAction = playbackStates.find(
				(state) => state === playbackState
			);
			if (!doNotPerformAction) {
				audioRef.current[playbackState]();
			}
		}
	}, [playbackState, audioRef.current]);

	React.useEffect(() => {
		if (playbackVolumeState <= 1 && playbackVolumeState >= 0 &&  audioRef.current) {
			audioRef.current.setVolume(playbackVolumeState);
		}
	}, [playbackVolumeState, audioRef.current]);

	React.useEffect(() => {
		if (selectedItem) {
			(async () => {
				if (audioRef.current) {
					await audioRef.current.stop();
					audioRef.current.off("play", () => {});
					audioRef.current.off("stop", () => {});
					audioRef.current.off("pause", () => {});
					audioRef.current.off("resume", () => {});
					audioRef.current = new player(selectedItem.path);
					audioRef.current.play();
				} else {
					audioRef.current = new player(selectedItem.path);
					updatePlaybackState("stopped");
				}
				audioRef.current.on("play", () => {
					updatePlaybackState("playing");
				});

				audioRef.current.on("stop", () => {
					updatePlaybackState("stopped");
				});

				audioRef.current.on("pause", () => {
					updatePlaybackState("paused");
				});

				audioRef.current.on("resume", () => {
					updatePlaybackState("playing");
				});
			})();

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
	}, [selectedItem]);

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

	const filterVals = ["title", "album", "year", "artist"];
	if (selectedItem) {
		return (
			<Box flexDirection="column" width="100%">
				<Box marginLeft={2}>
					<Text italic color="blueBright">
						Song Info
					</Text>
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
					{Object.keys(selectedItem)
						.filter((v) => filterVals.indexOf(v) >= 0)
						.map((key) => {
							return (
								<Box flexDirection="row" key={key}>
									<Box width={10}>
										<Text italic bold color="#2c3e50">
											{key.charAt(0).toUpperCase() + key.slice(1)}:{" "}
										</Text>
									</Box>
									<Text>{selectedItem[key]}</Text>
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
						<Text>{selectedItem.album || "N/A"}</Text>
						<Newline />
					</Box>

					<Box flexDirection="row">
						<Box width={10}>
							<Text bold color="#2c3e50" italic>
								Genre:{" "}
							</Text>
						</Box>
						<Text>
							{selectedItem.genre.length ? selectedItem.genre.join(",") : "N/A"}
						</Text>
						<Newline />
					</Box>

					<Box flexDirection="row">
						<Box width={10}>
							<Text bold color="#2c3e50" italic>
								Duration:{" "}
							</Text>
						</Box>
						<Text>{dateFormatter(selectedItem.duration)}</Text>
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
					borderColor="#004e92"
				>
					<Text>00:00:00</Text>
					<Text>{paddingString}</Text>
					<Gradient name="rainbow">
						<Text color={dividerColor}>{dividerSideStringLeft}</Text>
						<Text color={titleColor}>{titleString}</Text>
						<Text color={dividerColor}>{dividerSideStringRight}</Text>
						<Text>{paddingString}</Text>
					</Gradient>
					<Text>{dateFormatter(selectedItem.duration)}</Text>
				</Box>
				<Box
					paddingLeft={2}
					flexDirection="row"
					borderStyle="single"
					alignSelf="center"
					height={3}
					// marginLeft={2}
					width="95%"
					// justifyContent="center"
					borderColor="#004e92"
				>
					<Gradient name="morning">
					<Text>Volume : </Text>
						<Bar percent={1} columns={60} text="Volume" />
					</Gradient>
					{/* <Bar color="red" /> */}
					{/* <Text>00:00:00</Text>
					<Text>{paddingString}</Text>
					<Text color={dividerColor}>{dividerSideStringLeft}</Text>
					<Text color={titleColor}>{titleString}</Text>
					<Text color={dividerColor}>{dividerSideStringRight}</Text>
					<Text>{paddingString}</Text>
					<Text>{dateFormatter(selectedItem.duration)}</Text> */}
				</Box>
			</Box>
		);
	} else {
		return <Box flexDirection="row"></Box>;
	}
};

module.exports = Info;
