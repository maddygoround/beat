const React = require("react");
const constate = require("constate").default;

// 1️⃣ Create a custom hook as usual
function useContext() {
	const [playbackState, setPlaybackState] = React.useState();
	const [selectedItem, setSelectedItem] = React.useState();
	const updatePlaybackState = (value) => setPlaybackState(value);

	const updateSelectedItem = (item) => setSelectedItem(item);

	return {
		playbackState,
		selectedItem,
		updatePlaybackState,
		updateSelectedItem,
	};
}

const [ClientProvider, useClientContext] = constate(useContext);

module.exports = { useClientContext, ClientProvider };
