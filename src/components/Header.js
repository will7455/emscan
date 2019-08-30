import React, {Component} from 'react'
import Logo from '../assets/images/logo-emscan.svg'
import IconAva from '../assets/images/icon-ava.svg'
import FirebaseService from '../services/FirebaseService'
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import Button from './Button';
import List from '../assets/images/list.svg';

class Header extends Component {
    constructor(props) {
        super(props);

        this.state = {
           show: false,
           showMenu: false,
        }
    };

    onClick = () => {
       this.setState({
           show: !this.state.show
       })
    }

    logOut = () => {
        FirebaseService.logout();
    }

    showMenu = () => {
        this.setState({
            showMenu: !this.state.showMenu
        })
    }

    renderMenu () {
        return (
            <ul className="menu-header">
                <li><a href="https://empow.io" target="_blank" rel="noopener noreferrer">Empow</a></li>
                <li><a href="https://chrome.google.com/webstore/detail/empow-wallet/nlgnepoeokdfodgjkjiblkadkjbdfmgd" target="_blank" rel="noopener noreferrer">Empow Extension</a></li>
                <li><a href="/topholders">EM Holders</a></li>
                {this.props.loggedIn && <li><a href="/submitdapp">Submit DApp</a></li>}
                {this.props.loggedIn && <li><a href="/bonus">Set bonus</a></li>}
                {this.props.loggedIn && <li onClick={this.logOut}>Log out</li>}
                {this.props.loggedIn && <li>{FirebaseService.user.email.substring(0,20)}...</li>}
                {!this.props.loggedIn && <li><Link to="/signin">Sign In</Link></li>}
                {!this.props.loggedIn && <li><Link to="/signup">Sign Up</Link></li>}
            </ul>
        )
    }

    render() {
        return (
            <div className="header">
                <div className="container">
                    <img onClick={this.showMenu} className="list" src={List} alt="photos"></img>
                    <Link className="waper-logo" to="/">
                        <img src={Logo} alt="photos"></img>
                        <p>EMSCAN</p>
                    </Link>
                    <ul className="menu">
                        <li><a href="https://empow.io" target="_blank" rel="noopener noreferrer">Empow</a></li>
                        <li><a href="https://chrome.google.com/webstore/detail/empow-wallet/nlgnepoeokdfodgjkjiblkadkjbdfmgd" target="_blank" rel="noopener noreferrer">Empow Extension</a></li>
                        <li><a href="/topholders">EM Holders</a></li>
                        <li><a href="/submitdapp">Submit DApp</a></li>
                    </ul>
                    {this.props.loggedIn && <div className="waper-account">
                        <div className="info" onClick={this.onClick}>
                            <p>{FirebaseService.user.email.substring(0,20)}</p>
                            <img src={IconAva} alt="photos"></img>
                        </div>
                        {this.state.show && <ul className="detail">
                            <li><a href="/submitdapp">Submit Dapp</a></li>
                            <li><a href="/bonus">Set bonus</a></li>
                            <li onClick={this.logOut}>Log out</li>
                        </ul>}
                    </div>}
                    {!this.props.loggedIn && <div className="waper-button">
                        <Link to="/signin" className="button">
                            <Button>Sign In</Button>
                        </Link>
                        <Link to="/signup" className="button">
                            <Button>Sign Up</Button>
                        </Link>
                    </div>}
                    {this.state.showMenu && this.renderMenu()}
                </div>
            </div>
        );
    }
};

export default connect(state => ({
    loggedIn: state.app.loggedIn,
}), ({
}))(Header)