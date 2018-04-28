import React, { Component } from "react";
import axios from "axios";
import Emojify from "react-emojione";
import { Picker } from "emoji-mart";
import { FilePond, registerPlugin } from "react-filepond";

import "./ChatContainer.css";
import UserList from "../users/UserList";

import Chat from "../chat/Chat";
import NoChat from "../chat/NoChat";

const emojiPickerOptions = {
    set: "emojione",
    emoji: "point_up",
    title: "",
};

function setUser(user) {
    return localStorage.setItem("activeUser", JSON.stringify(user));
}

function getUser() {
    return JSON.parse(localStorage.getItem("activeUser"));
}

function getAuthUser() {
    return JSON.parse(window.auth.content);
}

function messagedTime() {
    const date = new Date();
    let hours = date.getHours();
    let minutes = date.getMinutes();
    const ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12;
    hours = hours || 12; // the hour '0' should be '12'
    minutes = minutes < 10 ? 0 + minutes : minutes;
    return `${hours} : ${minutes} ${ampm}`;
}

const emojifyOptions = {
    backgroundImage: 'url("/emojione-3.1.2-64x64.png")',
    height: 24,
    margin: 2,
};

class ChatContainer extends Component {
    constructor() {
        super();

        this.state = {
            loading: false,
            selectedUser: getUser() || null,
            searchUser: "",
            chats: null,
            authUser: getAuthUser(),
            userMessage: "",
            nextUrl: null,
            typing: false,
            newMessage: false,
            showPicker: false,
            showFileSelector: false,
            onlineUsers: [],
        };
    }

    componentDidMount() {
        const { selectedUser, authUser } = this.state;

        let typingTimeout;

        window.Echo.private(
            `private-chat-room-${(selectedUser && selectedUser.channel_id) ||
                authUser.my_channel_id}`
        )
            .listen(`Chat.PrivateMessageEvent`, e => {
                this.setState(
                    {
                        chats: [
                            ...this.state.chats,
                            {
                                username: e.user,
                                message: (
                                    <Emojify style={emojifyOptions}>
                                        {" "}
                                        <span className="chat-text">{e.message}</span>{" "}
                                    </Emojify>
                                ),
                                img: e.profile_image,
                                time: messagedTime(),
                                type: e.type,
                            },
                        ],
                    },
                    () => {
                        this.scrollToBottom();
                        this.setState({ typing: false });
                    }
                );
            })
            .listenForWhisper("typing", e => {
                const noText = e.name.length === 0;

                if (typingTimeout) {
                    clearTimeout(typingTimeout);
                }

                if (!noText) {
                    this.setState({ typing: true });
                } else {
                    this.setState({ typing: false });
                }

                typingTimeout = setTimeout(() => this.setState({ typing: false }), 1500);
            });

        window.Echo.join(`chat`)
            .here(users => {
                this.setState({ onlineUsers: users });

                const len = users.length;

                if (this.state.selectedUser && len > 0) {
                    for (var i = 0; i < len; i++) {
                        if (users[i].id === this.state.selectedUser.id) {
                            this.setState({
                                selectUser: { ...this.state.selectedUser, online: true },
                            });
                        }
                    }
                }
            })
            .joining(user => {
                const onlineusers = this.state.onlineUsers.map(user => {
                    return user.id;
                });

                if (onlineusers.indexOf(user.id) === -1) {
                    this.setState({ onlineUsers: [...this.state.onlineUsers, user] });
                }

                if (this.state.selectedUser && user.id === this.state.selectedUser.id) {
                    this.setState({ selectedUser: { ...this.state.selectedUser, online: true } });
                }
            })
            .leaving(user => {
                this.setState({
                    onlineUsers: this.state.onlineUsers.filter(singleuser => {
                        return user.id !== singleuser.id;
                    }),
                });

                if (this.state.selectedUser && user.id === this.state.selectedUser.id) {
                    this.setState({ selectedUser: { ...this.state.selectedUser, online: false } });
                }
            });

        this.getChats();
    }

    getChats = (next, scrollHeight) => {
        const { nextUrl } = this.state;

        axios({
            method: "GET",
            url: next ? nextUrl : "/api/messages",
            params: {
                receiver_id: this.state.selectedUser
                    ? this.state.selectedUser.id
                    : this.state.authUser.id,
            },
        })
            .then(response => {
                const data = response.data.data.map(chat => {
                    if (chat.message) {
                        chat.message = (
                            <Emojify style={emojifyOptions}>
                                {" "}
                                <span className="chat-text">{chat.message}</span>{" "}
                            </Emojify>
                        );
                    }
                    return chat;
                });

                if (next) {
                    this.setState(
                        {
                            chats: [...data.reverse(), ...this.state.chats],
                            nextUrl: response.data.next_page_url,
                        },
                        () =>
                            (this.refs.chatoutput.scrollTop =
                                this.refs.chatoutput.scrollHeight - scrollHeight)
                    );
                } else {
                    this.setState(
                        { chats: data.reverse(), nextUrl: response.data.next_page_url },
                        () => setTimeout(() => this.scrollToBottom(), 150)
                    );
                }

                return response.data.data;
            })
            .catch(error => {
                console.log(error.response.data);
            });
    };

    setTypingState = e => {
        this.setState({ userMessage: e.target.value });

        const { selectedUser, authUser, userMessage } = this.state;

        Echo.private(
            `private-chat-room-${(selectedUser && selectedUser.channel_id) ||
                authUser.my_channel_id}`
        ).whisper("typing", {
            name: userMessage,
        });
    };

    // isTyping = () => {
    //     const isTyping = this.state.typing;
    //     if (isTyping.length > 0) {
    //         setTimeout(() => {
    //             this.setState({
    //                 typing: false,
    //             });
    //         }, 2000);
    //     }
    // };

    emojiSetter = emoji => {
        const { colons } = emoji;
        const userMessage = this.state.userMessage;
        this.setState({ userMessage: userMessage + " " + colons + " ", showPicker: false });
        this.refs.userInput.focus();
    };

    submitNewMessage = e => {
        e.preventDefault();

        const message = this.state.userMessage;
        console.log(message);
        const selectedUser = this.state.selectedUser;

        if (message.length === 0) {
            return false;
        }

        this.setState(
            {
                chats: [
                    ...this.state.chats,
                    {
                        username: "You",
                        message: (
                            <Emojify style={emojifyOptions}>
                                <span className="chat-text">{message}</span>{" "}
                            </Emojify>
                        ),
                        img: "/images/customer.png",
                        time: messagedTime(),
                        type: 1,
                        user_id: this.state.authUser.id,
                    },
                ],
            },
            () => {
                this.setState({ userMessage: "" });
                this.scrollToBottom();
            }
        );

        const channel = {
            active: true,
            channel_id: selectedUser.channel_id,
            name: selectedUser.name,
            receiver_id: selectedUser.id,
        };

        axios({
            method: "POST",
            url: "/api/messages",
            data: {
                message,
                channel,
            },
        })
            .then(response => {
                // console.log(response);
            })
            .catch(error => {
                // console.log(error);
            });

        return true;
    };

    scrollToBottom = () => {
        if (this.refs.chatoutput != null) {
            this.refs.chatoutput.scrollTop = this.refs.chatoutput.scrollHeight;
        }
    };

    onScroll() {
        if (this.refs.chatoutput.scrollTop === 0) {
            this.getChats(true, this.refs.chatoutput.scrollHeight);
        }
    }

    selectUser = user => {
        this.setState({ selectedUser: user, searchUser: "" }, () => this.getChats(false));

        axios({
            method: "GET",
            url: `/api/chatroom/${user.id}`,
        })
            .then(response => {
                user.channel_id = response.data.id;
                setUser(user);
            })
            .catch(error => {
                user.channel_id = null;
                setUser(user);
            });
    };

    fileSelector = () => {
        if (!this.state.showFileSelector && this.pond) {
            this.pond.destroy();
        }
        this.setState({ showFileSelector: !this.state.showFileSelector });
    };

    handleInit = () => {
        setTimeout(() => this.pond.browse(), 250);
    };

    handleProcessing(fieldName, file, metadata, load, error, progress, abort) {
        // handle file upload

        const message = this.state.userMessage;
        const selectedUser = this.state.selectedUser;

        const channel = {
            active: true,
            channel_id: selectedUser.channel_id,
            name: selectedUser.name,
            receiver_id: selectedUser.id,
        };

        const data = new FormData();

        data.append("channel[active]", true);
        data.append("channel[channel_id]", selectedUser.channel_id);
        data.append("channel[name]", selectedUser.name);
        data.append("channel[receiver_id]", selectedUser.id);
        data.append("send_attachment", file);

        let config = {
            onUploadProgress: progressEvent => {
                let percentCompleted = Math.floor(progressEvent.loaded * 100 / progressEvent.total);
                progress(true, percentCompleted, 100);
            },
        };

        axios
            .post("/api/messages", data, config)
            .then(response => {
                this.setState(
                    {
                        chats: [
                            ...this.state.chats,
                            {
                                username: "You",
                                message: null,
                                document: response.data.document,
                                img: "/images/customer.png",
                                time: messagedTime(),
                                type: 2,
                                user_id: this.state.authUser.id,
                            },
                        ],
                    },
                    () => {
                        setTimeout(() => this.scrollToBottom(), 50);
                    }
                );

                load(response.data.id);
            })
            .catch(error => {
                // console.log(error);
            });

        return progress;
    }

    render() {
        const {
            selectedUser,
            searchUser,
            userMessage,
            chats,
            authUser,
            typing,
            newMessage,
            showPicker,
            onlineUsers,
            showFileSelector,
        } = this.state;

        return (
            <div className="chat-container">
                <div className="user-list">
                    <div className="user-list-header">
                        <h1 className="header-title">Colleagues</h1>
                        <input
                            type="text"
                            className="search-user"
                            name="search-user"
                            placeholder="Search User"
                            value={searchUser}
                            onChange={e => this.setState({ searchUser: e.target.value })}
                        />
                    </div>
                    <div className="user-list-body">
                        <UserList
                            selectedUser={selectedUser}
                            onClick={user => this.selectUser(user)}
                            searchUser={searchUser}
                            onlineUsers={onlineUsers}
                        />
                    </div>
                </div>
                <div className="chat-area">
                    <div className="chat-header">
                        {selectedUser && (
                            <h1 className="header-title">
                                {selectedUser.name}{" "}
                                <small>
                                    <i
                                        className={`${
                                            selectedUser.online
                                                ? "user-online  fa fa-circle"
                                                : "user-offline  fa fa-circle-o"
                                        } `}
                                        arial-hidden="true"
                                    >
                                        {" "}
                                    </i>
                                </small>
                            </h1>
                        )}
                    </div>
                    <div className="chat-body" ref="chatoutput" onScroll={() => this.onScroll()}>
                        {selectedUser ? (
                            <Chat chats={chats} authUser={authUser} typing={typing} />
                        ) : (
                            <NoChat />
                        )}
                    </div>
                    <div className="chat-footer">
                        <div className="user-interaction">
                            {typing && (
                                <p className="typing">{`${selectedUser.name}'s Typing ...`}</p>
                            )}

                            {newMessage && (
                                <button
                                    className="btn btn-orange"
                                    onClick={() => {
                                        this.scrollToBottom();
                                        this.setState({ newMessage: false });
                                    }}
                                >
                                    See Latest! <i className="fa fa-chevron-down" />{" "}
                                </button>
                            )}
                        </div>
                        <form encType="multipart/form-data" onSubmit={this.submitNewMessage}>
                            <div className="input-box">
                                <input
                                    type="text"
                                    name="userinput"
                                    autoComplete="off"
                                    placeholder="Type your message..."
                                    className="user-input"
                                    ref="userInput"
                                    value={userMessage}
                                    onChange={e => this.setTypingState(e)}
                                />
                                <div className="action">
                                    <i
                                        className="fa fa-smile-o fa-2x"
                                        arial-hidden="true"
                                        onClick={() =>
                                            this.setState({ showPicker: !this.state.showPicker })
                                        }
                                    />
                                    {showPicker && (
                                        <Picker
                                            style={{
                                                position: "absolute",
                                                bottom: "100%",
                                                right: "100%",
                                                zIndex: 3,
                                            }}
                                            {...emojiPickerOptions}
                                            onClick={(emoji, e) => {
                                                this.emojiSetter(emoji, e);
                                            }}
                                        />
                                    )}
                                    <i
                                        className="fa fa-paperclip fa-2x"
                                        arial-hidden="true"
                                        onClick={() => this.fileSelector()}
                                    />
                                    {showFileSelector && (
                                        <FilePond
                                            oninit={() => this.handleInit()}
                                            name="send_attachment"
                                            dropOnPage={true}
                                            allowMultiple={true}
                                            maxFiles={3}
                                            ref={ref => (this.pond = ref)}
                                            server={{ process: this.handleProcessing.bind(this) }}
                                        />
                                    )}
                                    <button type="submit" className="btn btn-default">
                                        <i className="fa fa-paper-plane" />
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        );
    }
}

export default ChatContainer;
