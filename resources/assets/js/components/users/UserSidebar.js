import React, { Component } from 'react';
import User from './User';
import axios from 'axios';
import { setUser, getUser, getAuthUser } from '../utils/Utils';

const Loading = (props) => (<h1>Loading ...</h1>);

class UserSidebar extends Component{
	constructor(props){
		super(props);

		this.state = {
			loading: true,
			users: null,
			filterUser: '',
		}
	}

	componentDidMount(){
		this.getUsers();

		window.Echo.join(`chat`)
            .here(users => {

            	const onlineUsers = users.map( user => user.id );

                this.setState({ users: this.state.users.map(user =>{
	                	onlineUsers.indexOf(user.id) !== -1 ? user.online = true : user.online = false;
	                	return user;
	                }) 
	            });

                const selectedUser = getUser();

                if(selectedUser) {
                	 selectedUser.online = onlineUsers.indexOf(selectedUser.id) !== -1 ? true : false

                	setUser(selectedUser);
                }

            })
            .joining(user => {

                this.setState({ users: this.state.users.map( singleuser => {
                		if(singleuser.id === user.id){
                			user.online = true;
                		}
                		return user;
	                }) 
	            });

                const selectedUser = getUser();

                if(selectedUser && selectedUser.id === user.id) {
                	selectUser.online = true;
                	setUser(selectedUser);
                }

            })
            .leaving(user => {

                this.setState({ users: this.state.users.map( singleuser => {
                		if(singleuser.id === user.id){
                			user.online = false;
                		}
                		return user;
	                }) 
	            });

                const selectedUser = getUser();

                if(selectedUser && selectedUser.id === user.id) {
                	selectUser.online = false;
                	setUser(selectedUser);
                }

            });
	}

	getUsers = () => {
		this.setState({ loading: true });

        axios({
        	method: 'GET',
        	url: '/api/users'
        })
      	.then(response => {
        	const users = response.data;
        	this.setState({ users, loading: false });
      	})
      	.catch(err => {
        	this.setState({ users: null, loading: false });
    	});

	}

	selectUser = (user) => {

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

        this.props.onUserSelect();
	}

	render(){
		const { filterUser, loading } = this.state;

		const selectedUser = getUser();

		const users = this.state.users && this.state.users.filter(user =>  filterUser === '' || user.name.toLowerCase().includes(filterUser.toLowerCase()));

		return(
			<div className="user-list">
		        <div className="user-list-header">
		            <h1 className="header-title">Colleagues</h1>
		            <input
		                type="text"
		                className="search-user"
		                name="search-user"
		                placeholder="Search User"
		                value={ filterUser }
		                onChange={e => this.setState({ filterUser: e.target.value })}
		            />
		        </div>
		        <div className="user-list-body">
		            <ul className="users-list-ul">
		                {loading ? <Loading /> : users && users.map((user) => (
		                    <User active={ selectedUser ? selectedUser.id === user.id : null} 
		                    	user={ user } 
		                    	onClick={ () => this.selectUser(user) } 
		                    	key={ user.id } />
		                ))}
		            </ul>
		        </div>
		    </div>
		)

	}
}

export default UserSidebar;