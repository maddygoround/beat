"use strict";
const React = require("react");
const importJsx = require("import-jsx");
const { Text, Box, render, useFocus } = require("ink");
const path = require("path");
const Divider = importJsx("./divider");
const { Tabs, Tab } = importJsx("./tabsFunc");
const Table = importJsx("./list");
const mm = require("music-metadata");
// const Player = require("player");
const mp3Regex = /.[mM][pP]3$/;
const App = () => {
	const [files, setFiles] = React.useState([]);
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
						no : files.length + 1,
						title: metadata.common.title,
						artist: metadata.common.artist,
						picture: metadata.common.picture,
						year: metadata.common.year,
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

	const filteredData = files.map(function (v, i) {
		var copy = {};
		for (let key in v) {
			if (key != "path" && key != "picture") {
				copy[key] = v[key];
			}
		}
		return copy;
	});

	return (
		// <>
		// 	<Box
		// 		height="100%"
		// 		borderColor="blue"
		// 		borderStyle="bold"
		// 		width="50%"
		// 		alignSelf="flex-start"
		// 	>
		// 		<Box alignSelf="flex-start" height={30}>
		// 			<Text>X</Text>
		// 		</Box>
		// 		<Box alignSelf="flex-start" borderColor="blue" borderStyle="bold">
		// 			<Text>X</Text>
		// 		</Box>
		// 		<Box alignSelf="flex-start" borderColor="blue" borderStyle="bold">
		// 			<Text>X</Text>
		// 		</Box>
		// 	</Box>
		// 	<Box
		// 		height="100%"
		// 		borderColor="blue"
		// 		borderStyle="bold"
		// 		width="50%"
		// 		alignSelf="flex-end"
		// 	>
		// 		<Box alignSelf="flex-start" height={30}>
		// 			<Text>X</Text>
		// 		</Box>
		// 		<Box alignSelf="flex-start" borderColor="blue" borderStyle="bold">
		// 			<Text>X</Text>
		// 		</Box>
		// 		<Box alignSelf="flex-start" borderColor="blue" borderStyle="bold">
		// 			<Text>X</Text>
		// 		</Box>
		// 	</Box>
		// </>
		<Tabs>
			<Tab name="foo" width="40%">
				{files.map((file, index) => {
					return (
						<Box key={index}>
							<Divider
								dividerColor="blue"
								titleColor="green"
								title="&#9673;"
								padding={2}
								width={50}
								file={file}
								dividerChar="-"
								moveInterval={(file.duration / 50) * 1000}
							/>
						</Box>
					);
				})}
			</Tab>
			<Tab name="foo1" width="60%">
				{filteredData.length && <Table data={filteredData} />}
			</Tab>
		</Tabs>
	);
};

module.exports = App;
