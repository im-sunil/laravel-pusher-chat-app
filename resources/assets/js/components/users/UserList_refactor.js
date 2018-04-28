import React from 'react';
import User from './User';

const UserList = ({ users }) => (
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
            <ul className="users-list-ul">
                {users && users.map((user,index) => (
                    <User active={ selectedUser ? selectedUser.id === user.id : null} user={user} onClick={ onClick } key={user.id}/>
                ))}
            </ul>
        </div>
    </div>
)