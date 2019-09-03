import React from 'react';
import HomeController from './controllers/HomeController';
import SubmitDappController from './controllers/SubmitDappController';
//import TronTransactionController from './controllers/TronTransactionController'
//import TronAddressController from './controllers/TronAddressController'
import EthereumTransactionController from './controllers/EthereumTransactionController'
import SignUpController from './controllers/SignUpController'
import SignInController from './controllers/SignInController'
import ForgotPassword from './controllers/ForgotPassword'
import BonusController from './controllers/BonusController'
import EthereumAddressController from './controllers/EthereumAddressController'
import EditDappController from './controllers/EditDappController'
import { BrowserRouter as Router, Route } from "react-router-dom";
import FirebaseService from './services/FirebaseService'
import { connect } from 'react-redux';
import {
    setLoggedIn
} from './reducers/appReducer'

import './assets/scss/style.scss';
import TopHolderController from './controllers/TopHolderController';

const routes = [
    {
        path : '/editdapp',
        exact : false,
        main : ({location, match}) => <EditDappController location={location}/>
    },
    {
        path : '/ethereum/address/:address?',
        exact : false,
        main : ({location, match}) => <EthereumAddressController location={location} match={match} />
    },
    {
        path: '/ethereum/tx/:txHash?',
        exact : false,
        main : ({location, match}) => <EthereumTransactionController location={location} match={match}/>
    },
    {
        path : '/topholders',
        exact : false,
        main : ({location}) => <TopHolderController location={location} />
    },
    {
        path : '/bonus',
        exact : false,
        main : ({location}) => <BonusController location={location} />
    },
    {
        path : '/submitdapp',
        exact : false,
        main : () => <SubmitDappController />
    },
    {
        path : '/forgotpassword',
        exact : false,
        main : () => <ForgotPassword />
    },
    {
        path : '/signin',
        exact : false,
        main : ({location}) => <SignInController location={location} />
    },
    {
        path : '/signup',
        exact : false,
        main : () => <SignUpController />
    },
    {
        path : '/',
        exact : true,
        main : () => <HomeController />
    }
];

class App extends React.Component {
    constructor (props) {
        super(props)
        FirebaseService.init(this.loginCallback.bind(this))
    }

    async loginCallback(user) {
        if(user) {
            FirebaseService.user = user
            this.props.setLoggedIn(true);
        } else {
            this.props.setLoggedIn(false);
        }
    }

    render() {
        return <Router>
                    {routes.map((route, index) => {
                        return <Route key={index} 
                                path={route.path} 
                                exact={route.exact} 
                                component={route.main}/>
                    })}
                </Router>
    }
}


export default connect(state => ({
}), ({
    setLoggedIn
}))(App)
