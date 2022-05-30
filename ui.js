"use strict";
const React = require("react");
const importJsx = require("import-jsx");
const { Text, Box, render, useFocus, Spacer } = require("ink");
const path = require("path");
const Info = importJsx("./components/Info");
const { Sections, Section } = importJsx("./components/Section");
const Table = importJsx("./components/Table");
const mm = require("music-metadata");
const Gradient = require("ink-gradient");
const { ClientProvider } = importJsx("./context");
// const Player = require("player");
const mp3Regex = /.[mM][pP]3$/;
const App = () => {
	const [files, setFiles] = React.useState([]);
	const [currentSelectedFileNo, setCurrentSelectedFileNo] = React.useState(1);
	const { isFocused } = useFocus({ autoFocus: true });
	const getAllFilesFromFolder = () => {
		return new Promise((resolve, reject) => {
			var walk = require("walk");
			var files = [];

			// Walker options
			var walker = walk.walk(path.join(__dirname, "music"), {
				followLinks: false,
			});

			walker.on("file", async function (root, stat, next) {
				// Add this file to the list of files
				let result = stat.name.match(mp3Regex);
				if (result) {
					const metadata = await mm.parseFile(root + "/" + stat.name);
					files.push({
						path: root + "/" + stat.name,
						no: files.length + 1,
						title: metadata.common.title,
						artist: metadata.common.artist,
						album: metadata.common.album,
						picture: metadata.common.picture,
						year: metadata.common.year,
						genre: metadata.common.genre || [],
						duration: metadata.format.duration,
					});
				}
				next();
			});

			walker.on("end", function () {
				resolve(files);
			});
		});
	};

	const fileDecoded = React.useCallback((audioBuffer) => {
		setDuration(audioBuffer.duration);
	}, []);

	React.useEffect(() => {
		(async () => {
			const allfiles = await getAllFilesFromFolder();
			setFiles(allfiles);
		})();
	}, []);


	// const file = files.find((file) => file.no === currentSelectedFileNo);
	return (
		<ClientProvider>
			<Sections>
				<Section name="info" width="39%">
					<Info
						dividerColor="#f6cd61"
						titleColor="#ff6f69"
						title="&#9673;"
						padding={1}
						width={50}
						dividerChar="-"
					/>
				</Section>
				<Section name="table" width="60%" marginLeft={2}>
					{files.length && <Table data={files} />}
				</Section>
			</Sections>

			<Box
				flexDirection="row"
				borderStyle="bold"
				borderColor="#7b4397"
				height={3}
			>
				<Gradient name="cristal">
					<Text> enter (play / pause) </Text>
				</Gradient>
				<Spacer />
				<Gradient name="cristal">
					<Text> q (quit) </Text>
				</Gradient>
				<Spacer />
				<Gradient name="cristal">
					<Text> + (+volume) </Text>
				</Gradient>
				<Spacer />
				<Gradient name="cristal">
					<Text> - (-volume) </Text>
				</Gradient>
				<Spacer />
				<Gradient name="cristal">
					<Text> s (stop) </Text>
				</Gradient>
				<Spacer />
				<Gradient name="cristal">
					<Text> up / down (move) </Text>
				</Gradient>
			</Box>
		</ClientProvider>
	);
};

module.exports = App;
