import React, { Component } from 'react';
import axios from 'axios';

import ChatHeader from './ChatHeader';
import ChatFooter from './ChatFooter';
import Chat from "./Chat";
import NoChat from "./NoChat";

import { setUser, getUser, getAuthUser, messagedTime } from '../utils/Utils';

const authUser = {
	id: 1
};

const typing = true;
const newMessage = false;

class ChatArea extends Component{
	constructor(props){
		super(props);

		this.state = {
			loading: true,
			chats: [],
			nextUrl: '',
		}
	}

	componentDidMount(){

		const selectedUser = getUser();

		window.Echo.private(
            `private-chat-room-${(selectedUser && selectedUser.channel_id) ||
                authUser.my_channel_id}`
        )
            .listen(`Chat.PrivateMessageEvent`, e => {
                this.setState({
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
                }, () => {
                    this.scrollToBottom()
                    this.setState({ typing: false })
                } );
            })
            .listenForWhisper("typing", e => {

                const noText = e.name.length === 0;

                if(typingTimeout){
                    clearTimeout(typingTimeout);
                }

                if(!noText){
                    this.setState({ typing: true });
                }else{
                    this.setState({ typing: false });
                }

                typingTimeout = setTimeout( () => this.setState({ typing: false }), 1500);

            });
	}

	componentWillReceiveProps(prevProps,nextProps){
		if(prevProps.selectedUser.id !== nextProps.selectedUser.id){
			this.getChats(false);
		}
	}

	getChats(next){
		const { nextUrl } = this.state;
		const selectedUser = getUser();

        axios({
            method: "GET",
            url: next ? nextUrl : "/api/messages",
            params: {
                receiver_id: selectedUser
                    ? selectedUser.id
                    : authUser.id,
            },
        })
        .then(response => {
            const data = response.data.data.map(chat => {
                chat.message = (
                    <Emojify style={emojifyOptions}>
                        {" "}
                        <span className="chat-text">{chat.message}</span>{" "}
                    </Emojify>
                );
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
                    () => this.scrollToBottom()
                );
            }

            return response.data.data;
        })
        .catch(error => {
            console.log(error.response.data);
        });
	}

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

	render(){

		const selectedUser = getUser();

		const { chats } = this.state;

		return(
			<div className="chat-area">
                <ChatHeader selectedUser={ selectedUser } />
                <div className="chat-body" ref="chatoutput" onScroll={() => this.onScroll()}>
                    {selectedUser ? (
                        <Chat chats={chats} authUser={authUser} typing={typing} />
                    ) : (
                        <NoChat />
                    )}
                </div>
                
            </div>
		)
	}
}

export default ChatArea;