import React from 'react';
import ReactDOM from 'react-dom';
import { Picker } from "emoji-mart";
import Emojify from 'react-emojione';
import { FormControl } from "react-bootstrap";
import InfiniteScroll from 'react-infinite-scroller'
import ChatHistory from "./ChatHistory";
import './App.css';
import '../../css/emojimart.css';
import Message from './Message.js';
class Chatroom extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            chats: [],
            typing:"",
            set: "emojione",
            emoji: "point_up",
            title: "",
            emojiBoxHide:"none",
            showPreview:false,
            file:"",
            hasMoreItems: true,
            nextHref: null
        };
        this.submitMessage = this.submitMessage.bind(this);
    }

    componentDidMount() {
      const options = { 
                        backgroundImage: 'url("/emojione-3.1.2-64x64.png")',
                        height: 24,  margin: 2, 
                      } ;
        Echo.private('chat')
                 .listen('Chat.ChatEvent', (e) => {
                  
                    this.setState({
                     chats: this.state.chats.concat([
                     {
                         username:e.user,
                         content:<Emojify style={options}> <span className="chat-text">{e.message}</span> </Emojify> ,
                         img: e.profile_image,
                         time:this.messagedTime(),
                         type:e.type,
                    }
                 ]
                 )  
             });
        }).listenForWhisper('typing', (e) => {
           const  isTyping= e.name.length==0;
        
               if(isTyping===false){

                this.setState({
                    typing:"Typing..." ,
                 });
                
               }
               if(isTyping){
                this.setState({
                    typing:"" ,
                 });
               }
           });
      this.chatHistory();
    }
    
    componentDidUpdate() {
     this.isTyping();
        
    }

    scrollToBottom() {
      var node = this.el;
      node.scrollTop = node.scrollHeight;;
    }
    scrollBack(){
      const el = this.el;
      if(el.scrollTop==0) {
        el.scrollTop =700 ;
      }
    }
    scrollToOrigin(){
      const el = this.el;
      const scrollHeight = el.scrollHeight;
       const height = el.clientHeight;
       const maxScrollTop = scrollHeight - height;
       el.scrollBottom = maxScrollTop > 0 ? maxScrollTop : 0;
    }
    chatHistory() {
         const options = { 
            backgroundImage: 'url("/emojione-3.1.2-64x64.png")',
            height: 24, 
            margin: 2, 
          } ;

        let url ="/api/messages";
        if(this.state.nextHref) {
            url = this.state.nextHref;
        }   
        if(this.state.hasMoreItems)  
        {
        axios.get(url, { params: {  }
          }) .then( (response) => {
          const { chats } = this.state;
            
           const  { data,next_page_url } = response.data ;

            if( data.length > 0 ) {
             if(next_page_url) {
              data.map((chat) => {
                   chats.unshift({
                    "id":chat.id,
                     username: "You",
                     content :<Emojify style={options}> <span className="chat-text">{chat.message}</span> </Emojify> ,
                     img: "/images/customer.png",
                     time:chat.created_at,
                     "type":chat.type,
                     "url":chat.url,
                     "thumbnail_url":chat.thumbnail_url,
                     "preview":false,

                   });

                   
              });
                  this.setState({
                      chats:chats,
                      nextHref: next_page_url
                  });
             }  else {
                console.log("else",next_page_url);
                  this.setState({
                      hasMoreItems: false
                  });
              }
                      
            }
          })
          .catch( (error) => {
            console.log(error);
          });
        }

        }   
    
    submitMessage(e) {
        e.preventDefault();
        const options = { 
                            backgroundImage: 'url("/emojione-3.1.2-64x64.png")',
                            height: 24, 
                            margin: 2, 
                        } ;
        let  formatedMessage  =[];
        const message = ReactDOM.findDOMNode(this.refs.msg).value;
       
        this.setState({
            chats: this.state.chats.concat([{
                username: "You",
                content :<Emojify style={options}> <span className="chat-text">{message}</span> </Emojify> ,
                 emojis:[],
                img: "/images/customer.png",
                time:this.messagedTime(),
                type:1
            }])
        }, () => {
            ReactDOM.findDOMNode(this.refs.msg).value = "";
           // this.scrollToBottom();
        });
  
        axios.post('/api/messages', {
              message:message
            })
          .then((response) =>  {
            //console.log(response);
          })
          .catch((error) =>  {
           // console.log(error);
        });
    }
    sendAttachment(e){
      const  chatroomForm = this.chatRoom;
      const data = new FormData(chatroomForm);      
      let reader = new FileReader();
      const img = new Image();
      const file = data.get("send_attachment");
      reader.onloadend = () => {
        img.src=reader.result;
        img.onload  = () => { 
        this.setState({
            chats: this.state.chats.concat([{
                    username: "You",
                    "type":2, 
                    username: "You",
                    content :"" ,
                    img: "/images/customer.png",
                    time:this.messagedTime(),
                    "url":reader.result,
                    "thumbnail_url":reader.result,
                    "preview":true,
            }])
        }, () => {
            ReactDOM.findDOMNode(this.refs.msg).value = "";
            //this.scrollToBottom();
        });       
       };  
      }

      if(file) {
      
          axios.post('/api/attachments', data)
                    .then(function (response) {
                      console.log(response);
                    })
                    .catch(function (err) {
                       console.log(err);
                    });
         reader.readAsDataURL(file);
      }
     
      }
    

    render() {
        const username = "You";
        const { chats } = this.state;
        
          return (
              <div className="chatroom" >
                    <ChatHistory 
                      history={chats} 
                      username={username} 
                      fetchHistory={()=>this.chatHistory() } 
                    />
                   <div className="row ">
                           <div>
                               <label  style={ {color:"gray", position: "absolute", left: "0", bottom: "58px", height: "22px", display: "block"}}>{ this.state.typing }</label>
                               <form className="input"  encType="multipart/form-data" 
                               ref={(input) => { this.chatRoom = input; }} >
                                   <div className="input-group">
                                        <input type="text" 
                                            className="form-control chat-input" 
                                            ref="msg"
                                            onChange={(e)=>this.setTypingState(e) } 
                                        />
                                        <button  onClick={ (e) => this.submitMessage(e) } 
                                                className="input-group-addon temp-btn">
                                                <i className="fa fa-paper-plane-o"></i>
                                        </button>
                                       <Picker  style= {
                                            { position: 'absolute', bottom: "42px",
                                            right: "0px", display:this.state.emojiBoxHide,
                                            zIndex: 3,
                                           }
                                        }
                                        {...this.state}
                                        onClick={ (emoji,e) => {this.emojiSetter(emoji, e) } }
                                        backgroundImageFn={(set, sheetSize) => `/emojione_64.png`}
                                        />
                                        <button className="input-group-addon temp-btn"
                                                onClick={ (e) => this.openEmojiBox(e) }>
                                            <i className="fa fa-smile-o"></i>
                                        </button>
                                       <label className="input-group-addon temp-btn send-attachment">
                                            <i className="fa fa-paperclip"></i>
                                          <input type="file" 
                                                    name="send_attachment"  
                                                    ref={(input) => { this.sendFile = input }}
                                                    onChange={ (e)=>{this.sendAttachment(e) }}
                                          />
                                       </label>
                                </div>
                               </form>
                           </div>
                   </div>
              </div>
            );    
    }
    setTypingState (e)  {
        const message = ReactDOM.findDOMNode(this.refs.msg).value;
          Echo.private('chat')
              .whisper('typing', {
                  name: message
          }); 
    };
    isTyping(){
      const  isTyping = this.state.typing;
       if(isTyping){
           setTimeout(() => {
                 this.setState({
                    typing:"",
                 });
            }, 2000); 
       }
    }
    messagedTime() {
        const date = new Date();
        let  hours = date.getHours();
        let minutes = date.getMinutes();
        const ampm = hours >= 12 ? 'PM' : 'AM';
        hours = hours % 12;
        hours = hours ? hours : 12; // the hour '0' should be '12'
        minutes = minutes < 10 ? '0'+minutes : minutes;
        const strTime = hours + ':' + minutes + ' ' + ampm;
        return strTime;
    }
    openEmojiBox(e) {
        e.preventDefault();
        const checkEmojiboxStatus= this.state.emojiBoxHide ;
        if(checkEmojiboxStatus == "block") {
            this.setState({
               emojiBoxHide: "none",
            });
        }
       if(checkEmojiboxStatus == "none") {
        this.setState({
           emojiBoxHide:"block",
        });
     }
      
    }
    emojiSetter(emoji,e) {
        const {id,colons}= emoji;
        ReactDOM.findDOMNode(this.refs.msg).value += colons;
     }

    getExtension(filename) {
      if(filename){
        return filename.split('.').pop();
      }
      return false;
    }

}

export default Chatroom;