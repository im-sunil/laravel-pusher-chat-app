import React, { Component } from "react";

const auth = () => JSON.parse(window.auth.content);
const wrapperStyle = {
	display: "inline-block",
	marginTop: "2px",
	marginBottom: "2px",
	marginRight: "4px",
	padding: "1px 3px",
	borderRadius: "5px",
	backgroundColor: "#fff",
	border: "1px solid #E8E8E8",
	cursor: "pointer",
	height: "1.4rem",
	lineHeight: "23px",
	WebkitUserSelect: "none",
	msUserSelect: "none",
	MozUserSelect: "none",
};

const emojiStyle = {
	lineHeight: "20px",
	verticalAlign: "middle",
	display: "inline-block",
};

const wrapperHover = {
	//border: '1px solid #4fb0fc'
};

const countStyle = {
	fontSize: "11px",
	fontFamily: "helvetica, arial",
	position: "relative",
	top: "-2px",
	padding: "0 1px 3px",
	color: "#959595",
};

const countHover = {
	color: "#4fb0fc",
};

const selectorStyle = {
	width: "100%",
	maxHeight: "400px",
	paddingBottom: "10px",
	position: "absolute",
	backgroundColor: "rgb(255, 255, 255)",
	right: 0,
	bottom: "51px",
	zIndex: "1000",
	borderBottom: "1px solid #ccc",
	borderRadius: "6px",
	textAlign: "left",
};

const User = ({ id, active, name, avatar_url }) => {
	return (
		<div>
			<span>
				<i
					className={`${
						active ? "user-online  fa fa-circle" : " user-offline fa fa fa-circle-thin "
					}`}
					arial-hidden="true"
				>
					{" "}
				</i>
			</span>

			<img className="img-avatar" src={avatar_url} />
			<span>{`${name}`}</span>
		</div>
	);
};

class SingleUser extends Component {
	constructor() {
		super();
		this.state = { hovered: false };
	}

	render() {
		const {
			name,
			count = 1,
			styles = {
				wrapperStyle: wrapperStyle,
				emojiStyle: emojiStyle,
				countStyle: countStyle,
				wrapperHover: wrapperHover,
				countHover: countHover,
			},
			onClick = () => {},
		} = this.props;

		const wrapperFinalStyle = this.state.hovered
			? { ...wrapperStyle, ...wrapperHover }
			: wrapperStyle;
		const countFinalStyle = this.state.hovered ? { ...countStyle, ...countHover } : countStyle;
		return (
			<div
				style={wrapperFinalStyle}
				onClick={() => onClick(name)}
				onMouseEnter={() => this.setState({ hovered: true })}
				onMouseLeave={() => this.setState({ hovered: false })}
			/>
		);
	}
}

const PickerUser = ({ onClick, user }) => (
	<div style={{ cursor: "pointer", padding: "5px" }} onClick={() => onClick()}>
		{user}
	</div>
);

const UserWrapper = ({ users }) => {
	users.map(({ name, id }) => <SingleUser name={name} key={0} />);
	``;
};
/* Not using*/

class UserSelector extends Component {
	constructor() {
		super();
		this.state = {
			filter: "",
			xHovered: false,
			scrollPosition: 0,
		};
	}

	onScroll() {
		this.setState({ scrollPosition: this.userContainer.scrollTop });
	}

	componentDidMount() {
		this.userContainer.addEventListener("scroll", () => {
			this.onScroll();
		});
	}

	componentWillUnMount() {
		this.userContainer.removeEventListener("scroll", () => {
			this.onScroll();
		});
	}

	render() {
		const { showing, onUserClick, close, onlineUsers } = this.props;
		const xStyle = {
			color: "#d87979",
			fontSize: "20px",
			cursor: "pointer",
			position: "absolute",
			right: "20px",
			top: "10px",
		};
		if (this.state.xHovered) {
			xStyle.color = "#f00";
		}
		const searchInput = (
			<div>
				<input
					className="user-search-input"
					type="text"
					placeholder="Search"
					value={this.state.filter}
					onChange={e => this.setState({ filter: e.target.value })}
				/>
			</div>
		);
		const x = (
			<span
				arial-role="label"
				style={xStyle}
				onClick={() => {
					this.setState({ xHovered: false });
					close();
				}}
				onMouseEnter={() => this.setState({ xHovered: true })}
				onMouseLeave={() => this.setState({ xHovered: false })}
			>
				x
			</span>
		);

		const show = this.props.users.filter(({ id, active, name, avatar_url }, i) => {
			return name.toLowerCase().indexOf(this.state.filter.toLowerCase()) !== -1;
		});
		const users = show.map((userItem, i) => {
			const { id, avatar_url } = userItem;
			let { active, name } = userItem;
			//	name = auth() && auth().id === id ? `${name} - (You)` : name;

			const objIndex = onlineUsers.findIndex(obj => obj.id === id);
			onlineUsers[objIndex] ? (active = true) : false;
			const username = { id, name, active };
			const user =
				show.length > 0 ? (
					<User name={name} avatar_url={avatar_url} active={active} />
				) : (
					<div>User not found</div>
				);

			return (
				<PickerUser
					key={i}
					user={user}
					onClick={() => {
						onUserClick(username);
						close();
					}}
				/>
			);
		});
		return (
			<div style={showing ? selectorStyle : { display: "none" }}>
				{searchInput}
				{x}
				<div
					style={{
						padding: "10px",
						paddingTop: "5px",
						maxHeight: "184px",
						overflowY: "auto",
					}}
					ref={node => (this.userContainer = node)}
				>
					{users.length > 0 ? users : "No matches found."}
				</div>
			</div>
		);
	}
}

class UserList extends Component {
	constructor(props) {
		super(props);
		this.state = { hovered: false, showSelector: false };
	}

	onKeyPress(e) {
		if (e.keyCode === 27) {
			this.closeSelector();
		}
	}

	onClick({ target }) {
		if (!this.node.contains(target) && this.state.showSelector) {
			this.closeSelector();
		}
	}

	componentDidMount() {
		document.addEventListener("click", (e, target) => this.onClick(e, target));
		document.addEventListener("keydown", e => this.onKeyPress(e));
	}

	componentWillUnMount() {
		document.removeEventListener("click", (e, target) => this.onClick(e, target));
		document.removeEventListener("keydown", e => this.onKeyPress(e));
	}

	closeSelector() {
		this.setState({ showSelector: false });
	}

	render() {
		const { users, onUserClick, onlineUsers } = this.props;
		const plusButtonStyle = this.state.hovered
			? { ...wrapperStyle, ...wrapperHover }
			: wrapperStyle;
		const plusStyle = this.state.hovered ? { ...countStyle, ...countHover } : countStyle;
		return (
			<div
				ref={node => (this.node = node)}
				className="btn btn-deafult input-group-addon temp-btn btn-at"
				onMouseEnter={() => this.setState({ hovered: true })}
				onMouseLeave={() => this.setState({ hovered: false })}
				onClick={() => this.setState({ showSelector: !this.state.showSelector })}
			>
				<i>@</i>
				<UserSelector
					tabindex={2}
					showing={this.state.showSelector}
					onUserClick={onUserClick}
					close={() => this.closeSelector()}
					users={users}
					onlineUsers={onlineUsers}
				/>
			</div>
		);
	}
}

export default UserList;
