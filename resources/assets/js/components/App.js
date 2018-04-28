import React, { Component } from 'react';
import { Picker ,Emoji} from 'emoji-mart'
import Emojify from 'react-emojione';
import './App.css';
import Chatroom from './Chatroom';
import ChatContainer from './containers/ChatContainer';

class App extends Component {
  	render() { return <ChatContainer />; }
}

export default App;