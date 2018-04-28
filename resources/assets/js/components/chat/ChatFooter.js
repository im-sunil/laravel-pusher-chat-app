import React, { Component } from 'react';

const ChatFooter = ({ selectedUser, onSubmit, userMessage, showPicker, onChange, typing = true, newMessage = false, }) => (
	<div className="chat-footer">
        <div className="user-interaction">

            {typing && <p className="typing">{ `${selectedUser.name}'s Typing ...` }</p>}

            {newMessage && <button className="btn btn-orange" onClick={ () => {
                this.scrollToBottom();
                this.setState({ newMessage: false });
            }}>See Latest!  <i className="fa fa-chevron-down" /> </button>}

        </div>
        <form onSubmit={onSubmit}>
            <div className="input-box">
                <input
                    type="text"
                    name="userinput"
                    autoComplete="off"
                    placeholder="Type your message..."
                    className="user-input"
                    value={userMessage}
                    onChange={e => this.setTypingState(e)}
                />
                <div className="action">
                    <i className="fa fa-smile-o fa-2x" arial-hidden="true" onClick={ () => this.setState({ showPicker: !this.state.showPicker })} /> 
                    {showPicker 
                        && <Picker 
                                style={{ position: 'absolute', bottom: '100%', right: '100%', zIndex: 3, }} 
                                {...emojiPickerOptions}
                                onClick={(emoji, e) => {
                                    this.emojiSetter(emoji, e);
                                }} />}
                    <i className="fa fa-paperclip fa-2x" arial-hidden="true">
                        {" "}
                    </i>
                    <button type="submit" className="btn btn-default">
                        <i className="fa fa-paper-plane" />
                    </button>
                </div>
            </div>
        </form>
    </div>
)

export default ChatFooter;