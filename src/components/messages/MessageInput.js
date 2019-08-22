import React, { Component } from "react";

export default class MessageInput extends Component {
  constructor(props) {
    super(props);

    this.state = {
      //A State to store the message that will be eventually sent.
      message: "",
      //A State to check whether the user is typing.
      isTyping: false
    };
  }

  //Submits the form in which the message input and send is contained.
  handleSubmit = e => {
    //Page reload prevention.
    e.preventDefault();
    //Calls "sendMessage" function.
    this.sendMessage();
    //Clears out the "message" State.
    this.setState({ message: "" });
  };

  //Calls the "sendMessage" function with "message" State argument.
  //> "sendMessage" function(f) recieved from: "../chats/ChatContainer.js"
  sendMessage = e => {
    this.props.sendMessage(this.state.message);
  };

  //Calls the "stopCheckingTyping" function that clears out the Interval that checks whether the user is typing ("typingInterval" inside "startCheckingTyping" function).
  componentWillUnmount() {
    this.stopCheckingTyping();
  }

  sendTyping = () => {
    //On the flight, we create a attribute that we bind to the class by using "this.", so we can use it somewhere else. It will store the time from when "sendTyping" function is called, which is when the logged user starts typing.
    this.lastUpdateTime = Date.now();
    //If the State "isTyping" is "false"...
    if (!this.state.isTyping) {
      //We switch it to "true".
      this.setState({ isTyping: true });
      //Passing the argument "true" we call "sendTyping" function coming from:
      //> "../chats/ChatContainer.js"
      this.props.sendTyping(true);
      //And run the "startCheckingTyping" function.
      this.startCheckingTyping();
    }
  };

  startCheckingTyping = () => {
    //Test console.
    // console.log("is typing");
    
    //This sets an Interval and sotores it in "typingInterval" variable to check whether 300ms or more have passed from the "lastUpdateTime" stored time to current time.
    this.typingInterval = setInterval(() => {
      if (Date.now() - this.lastUpdateTime > 300) {
        //If the difference between the current time and the "lastUpdateTime" is greater that 300ms, we change "isTypingState" to "false" and call "stopCheckingTyping" function to clear this Interval.
        this.setState({ isTyping: false });
        this.stopCheckingTyping();
      }
    }, 300);
  };
  
  stopCheckingTyping = () => {
    //Test console.
    // console.log("stopped typing");
    
    //If "typingInterval" variable is active, we clear it and passing the argument "true" we call "sendTyping" function coming from:
    //> "../chats/ChatContainer.js" 
    if (this.typingInterval) {
      clearInterval(this.typingInterval);
      this.props.sendTyping(false);
    }
  };

  render() {
    const { message } = this.state;
    return (
      <div className="message-input">
        <form onSubmit={this.handleSubmit} className="message-form">
          <input
            id="message"
            ref={"messageInput"}
            type="text"
            className="form-control"
            value={message}
            autoComplete={"off"}
            placeholder="Type message"
            onKeyUp={e => {
              e.keyCode !== 13 && this.sendTyping();
            }}
            //A fast and clean way to link a State with the typed text inside an Input or Text Box.
            onChange={({ target }) => {
              this.setState({ message: target.value });
            }}
          />
          {/* //"message.length < 1" is a ternary operator that becomes a "single evaluation" since we expect a boolean value from it. */}
          <button disabled={message.length < 1} type="submit" className="send">
            Send
          </button>
        </form>
      </div>
    );
  }
}
