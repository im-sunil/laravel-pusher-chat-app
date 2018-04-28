import React, { Component } from 'react';
import axios from 'axios';

import User from './User';

const Loading = (props) => (<h1>Loading ...</h1>)

class UserList extends Component{
    constructor(props){
        super(props);
        this.state = {
            loading: true,
            users: null,
            filterList: null,
        }

        this.getUsers = this.getUsers.bind(this);
    }

    componentWillMount(){
        this.getUsers();
    }

    componentWillReceiveProps(nextprops) {
        if (this.props.searchUser.toLowerCase() !== nextprops.searchUser.toLowerCase()) {
            const Users = this.state.filterList;
            this.setState({ users: Users.filter(( user ) =>{
                    return user.name.toLowerCase().indexOf( nextprops.searchUser.toLowerCase() ) !== -1
                })
            });
        }

        if(this.props.onlineUsers !== nextprops.onlineUsers){
            this.updateOnlineUser(nextprops.onlineUsers);
        }
        
    }

    updateOnlineUser = (onlineusers) => {
        const onlineUsers = onlineusers.map((user,ind) => {
            return user.id;
        });

        this.setState({ users: this.state.users && this.state.users.map( (user,ind) => {
                onlineUsers.indexOf(user.id) !== -1 ? user.online = true : user.online = false;
                return user;
            }) 
        });
    }

    getUsers(){
        this.setState({ loading: true });
        axios
          .get("/api/users")
          .then(response => {
            const users = response.data;
            if (users.length > 0) {
              this.setState({ users, filterList: users, loading: false }, () => this.updateOnlineUser(this.props.onlineUsers));

            } else {
              this.setState({ users: null, filterList: null, loading: false });
            }
          })
          .catch(err => {
            this.setState({ users: null, filterList: null, loading: false });
          });
    }

    render(){

        const { loading, users } = this.state;
        const { selectedUser, onClick } = this.props;

        return (
            loading ? <Loading /> : <ul className="users-list-ul">
                {users && users.map((user,index) => (
                    <User active={ selectedUser ? selectedUser.id === user.id : null} user={user} onClick={ onClick } key={user.id}/>
                ))}
            </ul>
        )
    }
}

export default UserList;