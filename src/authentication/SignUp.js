import React from 'react';
import Authentication from './Authentication';
import './SignUp.css';


class SignUp extends React.Component {

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

        Authentication.signup(
            credentials,
            () => {
                this.props.history.push("/login");
            },
            () => {
                this.setState({
                    error: "Unable to create account"
                });
            }
        );
    }

    onInputChange(e) {
        let id = e.target.id;
        let value = e.target.value;
        if(id === "SignUp_username") {
            this.setState({
                username: value
            });
        } else if(id === "SignUp_password") {
            this.setState({
                password: value
            });
        }
    }

    render() {
        return (
            <div className="SignUp">
                <div className="title">
                    SignUp
                </div>
                <div className="error">
                    {this.state.error}
                </div>
                <div className="input">
                    <div className="icon">
                    <i className="fa fa-user"></i>
                    </div>
                    <input type="text" id="SignUp_username" value={this.username} placeholder="user" onChange={this.onInputChange} />
                </div>
                <div className="input">
                    <div className="icon">
                    <i className="fa fa-lock"></i>
                    </div>
                    <input type="password" id="SignUp_password" value={this.password} placeholder="user123" onChange={this.onInputChange} />
                </div>

                <a href="login" style={{"marginBottom":"5px"}}>Go to Login</a>

                <button className="SignUp-button" onClick={this.handleSubmit}>
                    Submit
                </button>
            </div>
        );
    }
}

export default SignUp;