import React, { Component } from "react";
import  collect from "collect.js";
import "../../../css/Chatbox.css";
 
 class Chatbox extends Component {
     
    constructor(props) {
       super(props);
     }
   
    handleMessageSubmit(event) {
      event.preventDefault();
      const props = this.props;
      const messages = props.chat.messages;
      let message = this.inputMessage.value;

      if( message.length == 0){
         return null;
      }
      messages.push(message);
      props.messageTyped(messages,message);
      this.chatForm.reset();
      this.scrollToBottom();
    }
     
      scrollToBottom() {
        const scrollHeight = this.messageList.scrollHeight;
        const height = this.messageList.clientHeight;
        const maxScrollTop = scrollHeight - height;
        this.messageList.scrollTop = maxScrollTop > 0 ? maxScrollTop : 0 ;
      }
    render() {
        
        return (
            <div className=" col-lg-12 ">
              <li className="list-group-item active"  key={0} >Chat</li>
            <ul className="list-group" ref={(input) => {  this.messageList = input;}}>
                {
                  collect(this.props.chat.messages).map( (element,i) => {  
                        return(
                          
                            <li className="list-group-item list-group-item-info"  key={i+1}> {element} 
                             <span className="badge pull-right label label-info"   > You </span>
                            </li>
                          
                         ) ;
                    })
                }
               </ul>
                <div className="row">
                    <div className="col-lg-12">
                    <form ref={ (input) => this.chatForm = input } 
                          onSubmit={(event)=>{this.handleMessageSubmit(event)}}
                    autoComplete="off">
                         <div className = "input-group">
                           <input type="text" 
                                     className="form-control chat-text-area" 
                                     placeholder={"Send message ..."}     
                                     name="message" 
                                     ref={(input)=>{this.inputMessage= input}}
                             />
                           
                           <span className="input-group-btn">
                               <button className="btn btn-default" type="button">
                                  <i className="fa fa-paper-plane-o" aria-hidden="true"></i>
                                </button>
                                 <button className="btn btn-default" type="button">
                                  <i className="fa fa-smile-o" aria-hidden="true"></i>
                               </button>
                           </span>
                       </div> 
                       </form>
                       </div>
                 </div>
            </div>
        );
    }
}

export default Chatbox;