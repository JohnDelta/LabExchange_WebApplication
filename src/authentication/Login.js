import React from 'react';
import Authentication from './Authentication';
import './Login.css';


class Login extends React.Component {

    constructor() {
        super();

        this.state = {
            username: "",
            password: "",
            error: "",
        };

        this.onInputChange = this.onInputChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleSubmit() {

        var credentials = {
            username: this.state.username,
            password: this.state.password
        };

        Authentication.login(
            credentials,
            () => {
                this.props.history.push("/");
            },
            () => {
                this.setState({
                    error: "Unable to login"
                });
            }
        );
        
    }

    onInputChange(e) {
        let id = e.target.id;
        let value = e.target.value;
        if(id === "login_username") {
            this.setState({
                username: value
            });
        } else if(id === "login_password") {
            this.setState({
                password: value
            });
        }
    }

    render() {
        return (
            <div className="LoginWrapper">
                <div className="Login">
                    <div className="title">
                        Lab Exchange
                    </div>
                    <div className="error">
                        {this.state.error}
                    </div>
                    <div className="input">
                        <div className="icon">
                        <i className="fa fa-user"></i>
                        </div>
                        <input type="text" id="login_username" value={this.username} placeholder="user" onChange={this.onInputChange} />
                    </div>
                    <div className="input">
                        <div className="icon">
                        <i className="fa fa-lock"></i>
                        </div>
                        <input type="password" id="login_password" value={this.password} placeholder="user123" onChange={this.onInputChange} />
                    </div>
                    
                    {/* <a href="signup" style={{"marginBottom":"5px"}}>Go to Sign Up</a> */}

                    <button className="login-button" onClick={this.handleSubmit}>
                        Login
                    </button>
                </div>
            </div>
            
        );
    }
}

export default Login;