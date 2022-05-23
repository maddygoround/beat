/**
 * The <Tabs> component
 */
const React = require("react");
const { useStdin, Box, Text } = require("ink");
const readline = require("readline");

/**
 * A <Tab> component
 */
// eslint-disable-next-line react/prop-types
const Tab = ({ children, width }) => {
	if (typeof children !== "object") {
		return <Text>{children}</Text>;
	} else {
	    return <Box width="100%">{children}</Box>;
	}
};

const TabsWithStdin = ({
	isRawModeSupported,
	stdin,
	setRawMode,
	children,
	isFocused,
	...rest
}) => {
	const [activeTab, setActiveTab] = React.useState(0);
    const activeRef = React.useRef(null);

    console.log(activeTab);
	React.useEffect(() => {
		if (isRawModeSupported && stdin) {
			// use ink / node `setRawMode` to read key-by-key
			if (setRawMode) {
				setRawMode(true);
			}

			readline.emitKeypressEvents(stdin);
			stdin.on("keypress", handleKeyPress);
		}
	}, []);

	const handleKeyPress = (ch, key) => {
		switch (key.name) {
			case "tab":
				if (key.shift === true) {
					moveToPreviousTab();
				} else {
					moveToNextTab();
				}
				break;
		}
	};

	const moveToNextTab = () => {
		let nextTabId = activeRef.current + 1;
		if (nextTabId >= children.length) {
			nextTabId = 0;
		}
		handleTabChange(nextTabId);
	};

	const handleTabChange = (tabId) => {
		const tab = children[tabId];
    
		if (!tab) {
			return;
		}
        activeRef.current = tabId;
        setActiveTab(activeRef.current);
	};


	return (
		<Box flexDirection="row" {...rest} width="100%" >
			{children.map((child, key) => {
				const { name ,width } = child.props;
				// let colors = {};
				// if (isFocused !== false) {
				// 	colors = {
				// 		borderColor: activeTab === key ? "green" : undefined,
				// 		color: activeTab === key ? "black" : undefined,
				// 	};
				// } else {
				// 	colors = {
				// 		borderColor: activeTab === key ? "gray" : undefined,
				// 		color: activeTab === key ? "black" : undefined,
				// 	};
				// }

				return (
					<Box key={name} width={width} flexDirection="column">
						<Box width="100%">
							<Box
								width="100%"
                                borderColor="green"
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

const Tabs = (props) => {
	const { isRawModeSupported, stdin, setRawMode } = useStdin();

	return (
		<TabsWithStdin
			isRawModeSupported={isRawModeSupported}
			stdin={stdin}
			setRawMode={setRawMode}
			{...props}
		/>
	);
};

module.exports = { Tabs, Tab };
