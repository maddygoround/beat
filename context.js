const React = require("react");

const ClientContext = React.createContext([{}, () => {}]);

const ClientProvider = (props) => {

	const [state, setState] = useState();
    const [selectedItem, setSelectedItem] = useState();

	return (
		<ClientContext.Provider
			value={{
				playback: [state, setState],
				item: [selectedItem, setSelectedItem],
			}}
		>
			{props.children}
		</ClientContext.Provider>
	);
};

export { ClientContext, ClientProvider };
