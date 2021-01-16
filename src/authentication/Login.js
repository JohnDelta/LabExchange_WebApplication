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
        Authentication.login(() => {
            this.props.history.push("/messenger");
        });
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
            <div className="Login">
                <div className="title">
                    Login
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
                <button className="login-button" onClick={this.handleSubmit}>
                    Submit
                </button>
            </div>
        );
    }
}

export default Login;