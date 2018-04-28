import React from 'react';

const ChatHeader = ({ selectedUser }) => (
	<div className="chat-header">
        {selectedUser && (
            <h1 className="header-title">
                {selectedUser.name} 
                <small>
                    <i className={ `${selectedUser.online ? 'user-online  fa fa-circle' : 'user-offline  fa fa-circle-o'} `} arial-hidden="true" />
                </small>
            </h1>
        )}
    </div>
)

export default ChatHeader;