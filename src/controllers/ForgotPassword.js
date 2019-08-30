import React, {Component} from 'react'
import Headers from '../components/Header';
import Fooder from '../components/Fooder';
import Button from '../components/Button';
import FirebaseService from '../services/FirebaseService'
import { Redirect } from "react-router-dom";
import { connect } from 'react-redux';

class ForgotPassword extends Component {

    constructor(props) {
        super(props);

        this.state = {
            email: '',
            loading: false,
            error: false,
            success: false
        }
    };

    onForgot = (e) => {

        e.preventDefault()

        const {email} = this.state

        this.setState({
            loading: true,
            error: false,
            success: false
        })

        FirebaseService.forgot(
            email, 
            (error) => {
                if (error) {
                    this.setState({
                        loading: false,
                        error,
                        success: false})
                } else {
                    this.setState({
                        loading: false,
                        error: false,
                        success: 'We sent you an email to forgot password. Please check your email'})
                }
                
            }
        )
    }

    renderForgot() {
        return (
            <div className="bg-general" id="forgot-password">
                <Headers/>
                <div className="container">
                    <form>
                        {this.state.error && <div className="alert">{this.state.error}</div>}
                        {this.state.success && <div className="alert alert-success">{this.state.success}</div>}
                        <div className="child">
                            <p>Email</p>
                            <input placeholder="Email" required name="email" onChange={ (e) => this.setState({[e.target.name] : e.target.value})}></input>
                        </div>
                        <div onClick={(e) => this.onForgot(e)}>
                            <Button isLoading={this.state.loading} >Send</Button>
                        </div>
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
            return this.renderForgot();
        }
    }
}

export default connect(state => ({
    loggedIn: state.app.loggedIn,
}), ({
}))(ForgotPassword)