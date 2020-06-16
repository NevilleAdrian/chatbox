import React, { Component } from 'react'
import socketIOClient from 'socket.io-client';
import axios from 'axios'



export default class Chat extends Component {
    constructor(props) {
        super(props)
        this.state = { 
            message:'',
            socket: socketIOClient("https://obscure-bayou-71124.herokuapp.com"),
            postdata: [],
            received: '',
          }
          this.handleMessageChange = this.handleMessageChange.bind(this);
          this.submitForm = this.submitForm.bind(this);
      
    }
    
   
    
    receivedData() {
        axios
            .get("https://obscure-bayou-71124.herokuapp.com/chats")
            .then(res => {
                const data = res.data;
                console.log(data)
                this.setState({...this.state, postdata: data})
    
            });
    }
    recievedMessage() {
        const socket = this.state.socket
        socket.on("received", data => {
               this.setState({...this.state, received: data.message})
        });

      }

  
    

    componentDidMount() {
        this.receivedData()
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevState.postdata === this.state.postdata) {
          return this.receivedData();
        }
        if (prevState.received === this.state.received) {
            return this.recievedMessage();
        }
         

      
      }

      formatted_date(a) {
        var date = new Date(a);
        var newDate = date.toLocaleDateString();
        var slash = '/'
        var ret = newDate.replace(slash, '-')
        var newSlash = ret.replace('/', '-')
        return newSlash;
    }
    
 
  submitForm(e) {
    e.preventDefault();
    const socket = this.state.socket
    socket.emit("chat message", this.state.message);
    this.setState({...this.state, message: ''})

    return false;
    
  }


  handleMessageChange(e) {
    this.setState({...this.state, message: e.target.value})
}  




    render() {
        console.log('statedata',this.state.postdata )
        console.log('received',this.state.received )
        return (
            <div className="chat_window">
                <div className="top_menu">
                    <div className="buttons">
                        <div className="button close"></div>
                        <div className="button minimize"></div>
                        <div className="button maximize"></div>
                    </div>
                    <div className="title">Chat</div>
                </div>
              
                <ul id="messages" className="messages">
                {this.state.postdata.map(datum => (
                <>
                 <li >
                   {datum.message}
                </li>
                <span>by {datum.sender}<span style={{marginLeft:"4px"}}>{this.formatted_date(datum.createdAt)}</span></span>
                </>
                ))}
                
                </ul> 
              
               
                <div className="bottom_wrapper clearfix">
                 <i id="typing"></i>
                    <form method="POST" onSubmit={this.submitForm} id="form">
                        <div className="message_input_wrapper">
                            <input id="message" className="message_input"  placeholder="Type your message here..." value={this.state.message} onChange={this.handleMessageChange} />
                        </div>
                        <button className="send_message">Send</button>
                    </form>
                </div>
            </div>

        )
    }
}
