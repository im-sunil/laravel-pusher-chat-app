import React, { Component } from 'react';
import { render } from 'react-dom';

import UserList from './UserList';
const users = [  { } ];

class UserPopup extends Component {
  constructor() {
    super();
    this.state = {
      users
    };
  }

   onUserClick(name) {
     console.log(name);
   }

  render() {
    return (
      <UserPopup 
        users={this.state.users} 
        onUserClick={ (name)=> {this.onUserClick(name)} }
      />
    );
  }
}

export default UserPopup;
