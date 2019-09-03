import React, {Component} from 'react'
import Headers from '../components/Header';
import Fooder from '../components/Fooder';
import Button from '../components/Button';
import { Link } from 'react-router-dom';
import FirebaseService from '../services/FirebaseService'
import { Redirect } from "react-router-dom";
import { connect } from 'react-redux';
import ServerAPI from '../ServerAPI';

class SignUpController extends Component {
    constructor(props) {
        super(props);

        this.state = {
            email: '',
            password: '',
            repeatPassword: '',
            agree: false,
            error: false,
            success: false,
            loading: false
        }
    };

    onRegister = (e) => {
        e.preventDefault();
        const { email,password,repeatPassword,agree } = this.state


        if(!email || !password || !repeatPassword || email === '' || password === '' || repeatPassword === '') {
            this.setState({
                error: 'Please enter full information'
            })
            return
        }

        if(password !== repeatPassword) {
            this.setState({
                error: 'Repeat password is not same password'
            })
            return
        }

        if(!agree) {
            this.setState({
                error: 'Please agree our Terms of service'
            })
            return
        }

        this.setState({
            error: false,
            success: false,
            loading: true,
        })

        FirebaseService.register(
            email, 
            password, 
            async (error) => {
                if (error) {
                    this.setState({
                        error,
                        loading: false,
                        success: false})
                } else {
                    this.setState({
                        error: false,
                        loading: false,
                        success: 'Signup successfully. You can login now'}) 

                    var verify = await FirebaseService.verify();
       
                    console.log(verify);
                    
                    if (verify) {
                        ServerAPI.createUser(verify)
                    }
                }
            }
        )
    }

    onBlur = (e) => {
        let name = e.target.name;
        let value = e.target.value;

        this.setState({
            [name]: value
        });
    }

    onChange = () => {
        this.setState({
            agree: !this.state.agree
        })
    }

    renderSignUp() {
        return (
            <div className="bg-general" id="sign-up">
                <Headers/>
                <div className="container wrapper">
                    <form>
                        { this.state.error && <div className="alert">{this.state.error}</div>}
                        { this.state.success && <div className="alert alert-success">{this.state.success}</div>}
                        <div className="child">
                            <p>Email</p>
                            <input placeholder="Email" name="email" onChange={this.onBlur} required></input>
                        </div>
                        <div className="child">
                            <p>Password</p>
                            <input type="password" placeholder="Password" name="password" onChange={this.onBlur} required></input>
                        </div>
                        <div className="child">
                            <p>Repeat Password</p>
                            <input type="password" placeholder="Repeat Password" name="repeatPassword" onChange={this.onBlur} required></input>
                        </div>
                        <div className="waper">
                            <label className="checkbox">
                                <input type="checkbox" defaultChecked={this.state.agree} onChange={() => this.onChange()}/>
                                <span className="checkmark"></span>
                            </label>
                            <p>By creating an account you agree to our <span>Terms of Service</span></p>
                        </div>
                        <div onClick={(e) => this.onRegister(e)}>
                            <Button isLoading={this.state.loading}>Sign Up</Button>
                        </div>
                        <p className="text">Already an Empow member?<Link to="/signin">Sign in here</Link></p>
                    </form>
                </div>
                <Fooder/>
            </div>
        )
    }

    render() {
        if (this.props.loggedIn) {
            return <Redirect to={{
                pathname : '/',
            }} />
        } else {
            return this.renderSignUp();
        }
    }
}

export default connect(state => ({
    loggedIn: state.app.loggedIn,
}), ({
}))(SignUpController)