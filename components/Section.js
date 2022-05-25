/**
 * The <Sections> component
 */
const React = require("react");
const {  Box, Text } = require("ink");

/**
 * A <Section> component
 */
const Section = ({ children }) => {
	if (typeof children !== "object") {
		return <Text>{children}</Text>;
	} else {
	    return <Box width="100%">{children}</Box>;
	}
};

const Sections = ({
	children,
	isFocused,
	...rest
}) => {
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



module.exports = { Sections, Section };
