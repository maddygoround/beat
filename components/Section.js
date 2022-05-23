/**
 * The <Tabs> component
 */
const React = require("react");
const { useStdin, Box, Text } = require("ink");

/**
 * A <Tab> component
 */
// eslint-disable-next-line react/prop-types
const Section = ({ children, width }) => {
	if (typeof children !== "object") {
		return <Text>{children}</Text>;
	} else {
	    return <Box width="100%">{children}</Box>;
	}
};

const SectionsWithStdin = ({
	isRawModeSupported,
	stdin,
	setRawMode,
	children,
	isFocused,
	...rest
}) => {
	const [activeTab, setActiveTab] = React.useState(0);
	const activeRef = React.useRef(null);

	// console.log(activeTab);
	// React.useEffect(() => {
	// 	if (isRawModeSupported && stdin) {
	// 		// use ink / node `setRawMode` to read key-by-key
	// 		if (setRawMode) {
	// 			setRawMode(true);
	// 		}

	// 		readline.emitKeypressEvents(stdin);
	// 		stdin.on("keypress", handleKeyPress);
	// 	}
	// }, []);

	// const handleKeyPress = (ch, key) => {
	// 	switch (key.name) {
	// 		case "tab":
	// 			if (key.shift === true) {
	// 				moveToPreviousTab();
	// 			} else {
	// 				moveToNextTab();
	// 			}
	// 			break;
	// 	}
	// };

	// const moveToNextTab = () => {
	// 	let nextTabId = activeRef.current + 1;
	// 	if (nextTabId >= children.length) {
	// 		nextTabId = 0;
	// 	}
	// 	handleTabChange(nextTabId);
	// };

	// const handleTabChange = (tabId) => {
	// 	const tab = children[tabId];

	// 	if (!tab) {
	// 		return;
	// 	}
	//     activeRef.current = tabId;
	//     setActiveTab(activeRef.current);
	// };

	return (
		<Box flexDirection="row" {...rest} width="100%">
			{children.map((child, key) => {
				const { name, width, marginLeft } = child.props;

				return (
					<Box
						key={name}
						width={width}
						marginLeft={marginLeft}
						flexDirection="column"
					>
						<Box width="100%">
							<Box
								width="100%"
								borderColor="#614385"
								// {...colors}
								borderStyle="single"
								flexDirection="column"
								height={57}
							>
								{child}
							</Box>
						</Box>
					</Box>
				);
			})}
		</Box>
	);
};

const Sections = (props) => {
	const { isRawModeSupported, stdin, setRawMode } = useStdin();

	return (
		<SectionsWithStdin
			isRawModeSupported={isRawModeSupported}
			stdin={stdin}
			setRawMode={setRawMode}
			{...props}
		/>
	);
};

module.exports = { Sections, Section };
