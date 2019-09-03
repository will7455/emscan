import React, {Component} from 'react'
import Headers from '../components/Header';
import Fooder from '../components/Fooder';
import { connect } from 'react-redux';
import Ads from '../assets/images/ads.svg'
import ServerAPI from '../ServerAPI';
import { OWNER_ADDRESS } from '../constants/index'
import LoadingIcon from '../assets/images/loading.svg'

class TransactionDetail extends Component {

    constructor(props) {
        super(props);

        this.state = {
            topEmail: [],
            topAddress: [],
            loadingEmail: false,
            loadingAddress: false
        }
    };

    componentDidMount() {
        this.setupTopAddress();
        this.setupTopEmail();
    } 

    setupTopEmail = async () => {
        this.setState({
            loadingEmail: true
        })

        var topPoint = await ServerAPI.getTopPoint();
        
        this.setState({
            topEmail: topPoint,
            loadingEmail: false
        })
    }

    setupTopAddress = async () => {

        this.setState({
            loadingAddress: true
        })
        var topAddress = await ServerAPI.getTopAddress();
        this.setState({
            topAddress: topAddress ? topAddress.holders : [],
            loadingAddress: false
        })
    }

    renderAds() {
        return (
            <div className="ads">
                <img src={Ads} alt="photos"></img>
            </div>
        )
    }

    renderTransactionDetail() {
        return (
            <div className="bg-general" id="transaction-detail">
                <Headers/>
                <div className="container wrapper">
                    {this.renderAds()}
                    <div className="waper">
                        <ul className="list">
                            <li>
                                <div>
                                    <p>Top address holders</p>
                                    <p>Amount</p>
                                </div>
                            </li>

                            {this.state.loadingAddress && <div style={{textAlign: 'center'}}>
                                <img src={LoadingIcon} alt="photos"></img>
                            </div>}
                            
                            {!this.state.loadingAddress && this.state.topAddress.map((value, index) => {
                                if (value.address !== OWNER_ADDRESS) {
                                    return (<li>
                                            <div>
                                                <p>{value.address}</p>
                                                <p>{value.balance / 10**18} EM</p>
                                            </div>
                                        </li>)
                                }

                                return '';
                            })}
                        </ul>

                        <ul className="list">
                            <li>
                                <div>
                                    <p>Top email holders</p>
                                    <p>Amount</p>
                                </div>
                            </li>

                            {this.state.loadingEmail && <div style={{textAlign: 'center'}}>
                                <img src={LoadingIcon} alt="photos"></img>
                            </div>}
                            {!this.state.loadingEmail && this.state.topEmail.map((value, index) => {
                                return <li key={index}>
                                    <div>
                                        <p>{value.email}</p>
                                        <p>{value.value} EM</p>
                                    </div>
                                </li>
                            })}
                        </ul>
                    </div>
                </div>
                <Fooder/>
            </div>
        )
    }

    render() {
        return this.renderTransactionDetail();
    }
}

export default connect(state => ({
    loggedIn: state.app.loggedIn,
}), ({
}))(TransactionDetail)