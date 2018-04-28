import * as React from "react";
import * as ReactDOM from "react-dom";
import PropTypes from "prop-types";
import Message from "./Message";

class ChatHistory extends React.Component {
  constructor(props) {
    super(props);
    this.scrollAtBottom = true;
  }

  componentDidMount() {
    const { props } = this;
    props.fetchHistory();
  }
  componentWillUpdate(nextProps) {
    this.topMessage = false;
    this.bottomMessage = false;
    this.historyChanged = nextProps.history.length + 1 !== this.props.history.length;

    if (this.historyChanged) {
      const { messageList } = this.refs;
      const scrollPos = messageList.scrollTop;
      const scrollBottom = messageList.scrollHeight - messageList.clientHeight;
      this.scrollAtBottom = scrollBottom === 0 || scrollPos === scrollBottom;
      if (!this.scrollAtBottom) {
        if (scrollPos === 0) {
          const numMessages = messageList.childNodes.length;
          this.topMessage = numMessages === 0 ? null : messageList.childNodes[0];
          return;
        }
        if (scrollPos !== 0) {
          const numMessages = messageList.childNodes.length;
          this.bottomMessage = numMessages === 0 ? null : messageList.childNodes[numMessages - 1];
        }
      }
    }
  }
  componentDidUpdate() {
    if (this.historyChanged) {
      if (this.scrollAtBottom) {
        this.scrollToBottom();
      }
      if (this.topMessage) {
        ReactDOM.findDOMNode(this.topMessage).scrollIntoView();
        return;
      }

      if (this.bottomMessage) {
        ReactDOM.findDOMNode(this.bottomMessage).scrollIntoView();
        return;
      }
    }
  }

  onScroll() {
    const { refs, props } = this;
    const scrollTop = refs.messageList.scrollTop;
    if (scrollTop === 0) {
      props.fetchHistory();
    }
  }

  render() {
    const { props, onScroll } = this;
    const { history, username: user } = props;

    return (
      <ul className="chats " ref="messageList" onScroll={() => this.onScroll()}>
        {props.history.map((chat, i) => {
          return <Message key={history.length - i} chat={chat} user={user} />;
        })}
      </ul>
    );
  }
  scrollToBottom() {
    const { messageList } = this.refs;

    const scrollHeight = messageList.scrollHeight;
    const height = messageList.clientHeight;
    const maxScrollTop = scrollHeight - height;
    ReactDOM.findDOMNode(messageList).scrollTop = maxScrollTop > 0 ? maxScrollTop : 0;
  }
}

React.propTypes = {
  history: PropTypes.isRequired,
  fetchHistory: PropTypes.isRequired,
};

export default ChatHistory;
