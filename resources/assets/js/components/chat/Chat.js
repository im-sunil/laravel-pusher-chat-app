import React, { Component } from "react";

const ChatMessage = ({ chat, authUser }) => {
	const side = authUser.id === chat.user_id ? "right-chat" : "left-chat";

	if (chat.message) {
		return (
			<li className={`chat-box ${side}`}>
				<p>{chat.message} </p>
			</li>
		);
	} else {
		switch (chat.document.mime) {
			case "application/pdf": {
				return (
					<li className={`chat-box ${side}`}>
						<object data={chat.url} type="application/pdf" width="245" height="245">
							<p>
								<a href={chat.url}>{chat.document.name}!</a>
							</p>
						</object>
					</li>
				);
				break;
			}
			case "application/vnd.openxmlformats-officedocument.wordprocessingml.document": {
				return (
					<li className={`chat-box ${side}`}>
						<a href={chat.url} className="text-center" target="_blank" rel="noopener">
							<i className="fa fa-file-word-o fa-4x" />
							<p>{chat.document.name}</p>
						</a>
					</li>
				);
				break;
			}
			case "text/plain": {
				return (
					<li className={`chat-box ${side}`}>
						<a href={chat.url} className="text-center" target="_blank" rel="noopener">
							<i className="fa fa-file-text-o fa-4x" />
							<p>{chat.document.name}</p>
						</a>
					</li>
				);
				break;
			}
			case "video/x-m4v": {
				return (
					<li className={`chat-box ${side}`}>
						<video width="245" controls>
							<source src={`${chat.url}`} type="video/mp4" />
							<source src={`${chat.url}`} type="video/ogg" />
							Your browser does not support HTML5 video.
						</video>
					</li>
				);
				break;
			}
			case "image/png":
			case "image/svg":
			case "image/gif":
			case "image/JPEG":
			case "image/jpg":
			case "image/jpeg": {
				return (
					<li className={`chat-box ${side}`}>
						<img src={`${chat.thumbnail_url}`} alt={chat.document.name} />
					</li>
				);
				break;
			}
			default: {
				return <li className={`chat-box ${side}`} />;
				break;
			}
		}
	}

	return (
		<li className={`chat-box ${side}`}>
			<p>
				{chat.message ? (
					chat.message
				) : (
					<img src={`${chat.thumbnail_url}`} alt={chat.document.name} />
				)}{" "}
			</p>
		</li>
	);
};

const Chat = ({ chats, authUser, typing }) => {
	return (
		<ul className="chats clearfix">
			{chats &&
				chats.map((chat, index) => (
					<ChatMessage key={index} chat={chat} authUser={authUser} />
				))}
		</ul>
	);
};

export default Chat;
