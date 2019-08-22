import React, { Component } from 'react';
import { VERIFY_USER } from '../Events';

export default class LoginForm extends Component {
    constructor(props) {
        super(props) 
        this.state = {
            nickname: "",
            error: ""
        }
    }

    //This parameter syntax means that the functions only accepts an object and that object needs to have at least two attributes with the name of "users" and "isUser" respectively. The object might have other attributes which will be ignored as far as the function cat take the above mentioned ones.
    setUser = ({user, isUser}) => {

        //Test console.
        // console.log(user, isUser);

        //If the user exists it will throw the "setError" function. Otherwise it will also throw "setError" function but with an empty string. Additionally, it will throw the "setUser" function that comes form the "props" with the "user" argument that was intaken by this function.
        //> "./Layout.js"
        if (isUser) {
            this.setError("User name is taken");
            
        } else {
            this.setError("");
            //> "./Layout.js  (f)setUser"
            this.props.setUser(user);
        }
    }
    
    //
    handleSubmit = (e) => {
        //Prevents page reloading.
        e.preventDefault();
        
        //Brings the socket connection to be able to "emit" to it.
        //> "./Layout.js  (f)initSocket"
        const {socket} = this.props;
        const {nickname} = this.state;

        //Emits to this socket endpoint and sends "this.sate.nickname" and the "setUser" function of this Component.
        socket.emit(VERIFY_USER, nickname, this.setUser);
    }

    handleChange = (e) => {
        //Just keeps to "this.state.nickname" whatever it is being typed on the input.
        this.setState({nickname: e.target.value});
    }

    setError = (error) => {
        //Keeps in "this.state.error" any error passed into this function.
        this.setState({error});
    }

    render () {
        //Creates "nickname" and "error" constants out of the Component States.
        const {nickname, error} =this.state;

        return ( 
            <div className="login">
                <form onSubmit={this.handleSubmit} className="login-form">
                    <label htmlFor="nickname">
                        <h2>Type your nickname</h2>
                    </label>
                    {/* //~ ++++++++++ Input box ++++++++++ */}
                    <input
                        //! Still pending to understand.
                        //! Is it another way to create references to HTML elements?
                        /*
                        Update: Yes! It is an older way to user "refs". As from 16.3 version of React, the way would be to declare them in the constructor like this:
                        ?this.myRef = React.createRef();
                        */
                        ref={(input) => {this.textInput = input}}
                        type="text"
                        id="nickname"
                        value={nickname}
                        onChange={this.handleChange}
                        placeholder={'Your nickname'}
                    ></input>
                    {/* // This will only show the error message if the user is already logged in. */}
                    <div className="error">{error ? error: null}</div>
                </form>
            </div>
        )
    }
}