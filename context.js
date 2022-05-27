const React = require("react");
const constate = require("constate").default;

// 1️⃣ Create a custom hook as usual
function useContext() {
	const [playbackState, setPlaybackState] = React.useState();
    const [playbackVolumeState, setPlaybackVolumeState] = React.useState(1);
	const [selectedItem, setSelectedItem] = React.useState();
	const updatePlaybackState = (value) => setPlaybackState(value);
    const updatePlaybackVolumeState = (value) => (value <= 1 && value >= 0) && setPlaybackVolumeState(value);
	const updateSelectedItem = (item) => setSelectedItem(item);

	return {
		playbackState,
		selectedItem,
		playbackVolumeState,
		updatePlaybackState,
		updateSelectedItem,
		updatePlaybackVolumeState,
	};
}

const [ClientProvider, useClientContext] = constate(useContext);

module.exports = { useClientContext, ClientProvider };
