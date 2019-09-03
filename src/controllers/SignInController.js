import React, {Component} from 'react'
import Headers from '../components/Header';
import Fooder from '../components/Fooder';
import Button from '../components/Button';
import { Link } from 'react-router-dom';
import { Redirect } from "react-router-dom";
import { connect } from 'react-redux';
import FirebaseService from '../services/FirebaseService'

class SignInController extends Component {

    constructor(props) {
        super(props);

        this.state = {
            email: '',
            password: '',
            loading: false,
            error: false,
        }
    };

    onBlur = (e) => {
        let name = e.target.name;
        let value = e.target.value;

        this.setState({
            [name]: value
        });
    }

    onLogin = (e) => {
        e.preventDefault()

        this.setState({
            error: false,
            loading: true
        })

        const { email,password } = this.state

        FirebaseService.login(
            email, 
            password, 
            (error) => {
                if (error) {
                    this.setState({
                        error,
                        loading: false})
                } else {
                    this.setState({
                        error: false,
                        loading: false}) 
                }
            }
        )
    }
    
    renderSignIn() {
        return (
            <div className="bg-general" id="sign-in">
                <Headers/>
                <div className="container wrapper">
                    <form>
                        { this.state.error && <div className="alert">{this.state.error}</div> }
                        <div className="child">
                            <p>Email</p>
                            <input placeholder="Email" required name="email" onChange={this.onBlur}></input>
                        </div>
                        <div className="child">
                            <p>Password</p>
                            <input type="password" placeholder="Password" required name="password" onChange={this.onBlur}></input>
                            <Link to="/forgotpassword" className="forgot">Forgot password?</Link>
                        </div>
                        <div className="login" onClick={(e) => this.onLogin(e)}>
                            <Button isLoading={this.state.loading}>Login</Button>
                        </div>
                        <p className="text">New here?<Link to="/signup">Create an Empow Account</Link></p>
                    </form>
                </div>
                <Fooder/>
            </div>
        )
    }

    render() {
        if (this.props.loggedIn) {
            var location = this.props.location && this.props.location.state && this.props.location.state.referrer ? this.props.location.state.referrer : '/';
            return <Redirect to={{
                pathname : location,
            }} />
        } else {
            return this.renderSignIn();
        }
    }
}

export default connect(state => ({
    loggedIn: state.app.loggedIn,
}), ({
}))(SignInController)