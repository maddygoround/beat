const React = require("react");
const { Box, Text, useStdin } = require("ink");
const { sha1 } = require("object-hash");
const readline = require("readline");
/* Table */

// type Scalar = string | number | boolean | null | undefined

// type ScalarDict = {
//   [key: string]: Scalar
// }

// export type TableProps<T extends ScalarDict> = {
//   /**
//    * List of values (rows).
//    */
//   data: T[]
//   /**
//    * Columns that we should display in the table.
//    */
//   columns: (keyof T)[]
//   /**
//    * Cell padding.
//    */
//   padding: number
//   /**
//    * Header component.
//    */
//   header: (props: React.PropsWithChildren<{}>) => JSX.Element
//   /**
//    * Component used to render a cell in the table.
//    */
//   cell: (props: React.PropsWithChildren<{}>) => JSX.Element
//   /**
//    * Component used to render the skeleton of the table.
//    */
//   skeleton: (props: React.PropsWithChildren<{}>) => JSX.Element
// }

/* Table */

const TableWithStdin = (props) => {
	/* Config */

	/**
	 * Merges provided configuration with defaults.
	 */

	const [active, setActive] = React.useState(1);
	const activeRef = React.useRef(0);

	React.useEffect(() => {
		const { isRawModeSupported, stdin, setRawMode } = props;
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
			case "up":
				moveToPreviosItem();
				break;
			case "down":
				moveToNextItem();
				break;
		}
	};

	const moveToNextItem = () => {
		let nextItemId = activeRef.current + 1;
		if (nextItemId >= props.data.length) {
			nextItemId = 0;
		}
		handleItemChange(nextItemId);
	};

	const moveToPreviosItem = () => {
		let nextItemId = activeRef.current - 1;
		if (nextItemId < 0) {
			nextItemId = props.data.length - 1;
		}
		handleItemChange(nextItemId);
	};

	const handleItemChange = (itemId) => {
		const item = props.data[itemId];

		if (!item) {
			return;
		}

		activeRef.current = itemId;
		setActive(item.no);
	};

	const getConfig = () => {
		return {
			data: props.data,
			columns: props.columns || getDataKeys(),
			padding: props.padding || 3,
			header: props.header || Header,
			cell: props.cell || Cell,
			skeleton: props.skeleton || Skeleton,
		};
	};

	/**
	 * Gets all keyes used in data by traversing through the data.
	 */
	const getDataKeys = () => {
		let keys = new Set();

		// Collect all the keys.
		for (const data of props.data) {
			for (const key in data) {
				keys.add(key);
			}
		}

		return Array.from(keys);
	};

	/**
	 * Calculates the width of each column by finding
	 * the longest value in a cell of a particular column.
	 *
	 * Returns a list of column names and their widths.
	 */
	const getColumns = () => {
		const { columns, padding } = getConfig();

		const widths = columns.map((key) => {
			const header = String(key).length;
			/* Get the width of each cell in the column */
			const data = props.data.map((data) => {
				const value = data[key];

				if (value == undefined || value == null) return 0;
				return String(value).length;
			});

			const width = Math.max(...data, header) + padding * 2;

			/* Construct a cell */
			return {
				column: key,
				width: width,
				key: String(key),
			};
		});

		return widths;
	};

	/**
	 * Returns a (data) row representing the headings.
	 */
	const getHeadings = () => {
		const { columns } = getConfig();

		const headings = columns.reduce(
			(acc, column) => ({ ...acc, [column]: column }),
			{}
		);

		return headings;
	};

	/* Rendering utilities */

	// The top most line in the table.
	// const header = row({
	// 	cell: getConfig().skeleton,
	// 	padding: getConfig().padding,
	// 	skeleton: {
	// 		component: getConfig().skeleton,
	// 		// chars
	// 		line: "─",
	// 		left: "┌",
	// 		right: "┐",
	// 		cross: "┬",
	// 	},
	// });

	// The line with column names.
	const heading = row({
		cell: getConfig().header,
		padding: getConfig().padding,
		skeleton: {
			component: getConfig().skeleton,
			// chars
			line: " ",
			left: "│",
			right: "│",
			cross: "│",
		},
	});

	// The line that separates rows.
	// const separator = row({
	// 	cell: getConfig().skeleton,
	// 	padding: getConfig().padding,
	// 	skeleton: {
	// 		component: getConfig().skeleton,
	// 		// chars
	// 		line: "─",
	// 		left: "├",
	// 		right: "┤",
	// 		cross: "┼",
	// 	},
	// });

	// The row with the data.
	const data = row({
		cell: getConfig().cell,
		activeItem: active,
		padding: getConfig().padding,
		skeleton: {
			component: getConfig().skeleton,
			// chars
			line: " ",
			left: "│",
			right: "│",
			cross: "│",
		},
	});

	// The bottom most line of the table.
	//   footer = row<T>({
	//     cell: this.getConfig().skeleton,
	//     padding: this.getConfig().padding,
	//     skeleton: {
	//       component: this.getConfig().skeleton,
	//       // chars
	//       line: '─',
	//       left: '└',
	//       right: '┘',
	//       cross: '┴',
	//     },
	//   })

	/* Render */

	/* Data */
	const columns = getColumns();
	const headings = getHeadings();

	/**
	 * Render the table line by line.
	 */
	return (
		<Box flexDirection="column">
			{/* Header */}

			{/* { header({ key: 'header', columns, data: {} })},  */}
			{heading({ key: "heading", columns, data: headings })}

			{/* Data */}
			{props.data.map((row, index) => {
				// Calculate the hash of the row based on its value and position
				const key = `row-${sha1(row)}-${index}`;
				const isActive = active === row.no;
				// Construct a row.
				return (
					<Box flexDirection="column" key={key}>
						{/* {separator({ key: `separator-${key}`, columns, data: {} })} */}
						{data({ key: `data-${key}`, columns, data: row, isActive })}
					</Box>
				);
			})}
			{/* Footer */}
			{/* {this.footer({ key: 'footer', columns, data: {} })} */}
		</Box>
	);
};

/* Helper components */

// type RowConfig = {
//   /**
//    * Component used to render cells.
//    */
//   cell: (props: React.PropsWithChildren<{}>) => JSX.Element
//   /**
//    * Tells the padding of each cell.
//    */
//   padding: number
//   /**
//    * Component used to render skeleton in the row.
//    */
//   skeleton: {
//     component: (props: React.PropsWithChildren<{}>) => JSX.Element
//     /**
//      * Characters used in skeleton.
//      *    |             |
//      * (left)-(line)-(cross)-(line)-(right)
//      *    |             |
//      */
//     left: string
//     right: string
//     cross: string
//     line: string
//   }
// }

// type RowProps<T extends ScalarDict> = {
//   key: string
//   data: Partial<T>
//   columns: Column<T>[]
// }

// type Column<T> = {
//   key: string
//   column: keyof T
//   width: number
// }

/**
 * Constructs a Row element from the configuration.
 */
const row = (config) => {
	/* This is a component builder. We return a function. */

	const skeleton = config.skeleton;

	const dateFormatter = React.useCallback((data) => {
		return new Date(data * 1000).toUTCString().match(/(\d\d:\d\d:\d\d)/)[0];
	}, []);
	/* Row */

	return (props) => (
		<Box flexDirection="row">
			{/* Left */}
			{/* <skeleton.component>{skeleton.left}</skeleton.component> */}
			{/* Data */}
			{intersperse(
				(i) => {
					const key = `${props.key}-hseparator-${i}`;

					// The horizontal separator.
					// return (
					// 	<skeleton.component key={key}>{skeleton.cross}</skeleton.component>
					// );
				},

				// Values.
				props.columns.map((column) => {
					// content
					let value = props.data[column.column];

					if (column.column === "duration" && props.key !== "heading") {
						value = dateFormatter(value);
					}

					if (props.key === "heading") {
						value = value.toUpperCase();
					}
					if (value == undefined || value == null) {
						const key = `${props.key}-empty-${column.key}`;

						return (
							<config.cell key={key}>
								{skeleton.line.repeat(column.width)}
							</config.cell>
						);
					} else {
						const key = `${props.key}-cell-${column.key}`;

						// margins
						const ml = config.padding;
						const mr = column.width - String(value).length - config.padding;

						return (
							/* prettier-ignore */
							<config.cell  key={key} isActive={props.isActive}>
                                {`${skeleton.line.repeat(ml)}${String(value)}${skeleton.line.repeat(mr)}`}
                            </config.cell>
						);
					}
				})
			)}
			{/* Right */}
			{/* <skeleton.component>{skeleton.right}</skeleton.component> */}
		</Box>
	);
};

// /**
//  * Renders the header of a table.
//  */
const Header = (props) => {
	return (
		<Text bold color="blue">
			{props.children}
		</Text>
	);
};

/**
 * Renders a cell in the table.
 */
const Cell = (props) => {
	return (
		<Text color={`${props.isActive ? "green" : ""}`}>{props.children}</Text>
	);
};

/**
 * Redners the scaffold of the table.
 */
const Skeleton = (props) => {
	return <Text bold>{props.children}</Text>;
};

/* Utility functions */

/**
 * Intersperses a list of elements with another element.
 */
const intersperse = (intersperser, elements) => {
	// Intersparse by reducing from left.
	let interspersed = elements.reduce((acc, element, index) => {
		// Only add element if it's the first one.
		if (acc.length === 0) return [element];
		// Add the intersparser as well otherwise.
		return [...acc, intersperser(index), element];
	}, []);

	return interspersed;
};

const Table = (props) => {
	const { isRawModeSupported, stdin, setRawMode } = useStdin();

	return (
		<TableWithStdin
			isRawModeSupported={isRawModeSupported}
			stdin={stdin}
			setRawMode={setRawMode}
			{...props}
		/>
	);
};

module.exports = Table;
