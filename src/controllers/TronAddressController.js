import React, {Component} from 'react'
import Headers from '../components/Header';
import Fooder from '../components/Fooder';
import ButtonCopy from '../components/ButtonCopy';
import IconCopy from '../assets/images/icon-copy.svg'
import IconDown from '../assets/images/icon-down.svg'
import IconUp from '../assets/images/icon-up.svg'
import Ads from '../assets/images/ads.svg'
import LogoTron from '../assets/images/logo-tron.svg'
import { CircularProgressbarWithChildren } from 'react-circular-progressbar';
import $ from "jquery"

class TronAddressController extends Component {

    constructor(props) {
        super(props);

        this.state = {
            data: [
                {
                    token: ""
                },
                {
                    token: "TRX (TRX)",
                },
                {
                    token: "BitTorrent (BTT)",
                },
                {
                    token: "Canabis (THC)",
                },
                {
                    token: "Claritytoken (TLC)",
                },
                {
                    token: "CollegeFund (CF)",
                },
                {
                    token: "Claritytoken (TLC)",
                }
            ],
            page: 1
        }
    };

    onClickPage = (index) => {
        this.setState({
            page: index
        })
    }

    onClickButton = (e) => {
        $(".waper-button button").removeClass("active");
        $(e.target).addClass("active");
    }

    renderAds() {
        return (
            <div className="ads">
                <img alt="photos" src={Ads}></img>
            </div>
        )
    }

    renderAddress() {
        return (
            <div className="waper-address">
                <div className="title">
                    <div className="logo-circle logo-tron">
                        <img alt="photos" src={LogoTron}></img>
                    </div>
                    <p>ADDRESS</p>
                </div>
                <div className="content">
                    <ul className="menu-general">
                        <li>
                            <p className="field">Address:</p>
                            <div className="value">
                                <p style={{marginRight: '5px'}}>TUcU758qMCmufRsEqS4dL5jupw3EZ6wKAn</p>
                                <ButtonCopy copyIcon={IconCopy} copyText="TUcU758qMCmufRsEqS4dL5jupw3EZ6wKAn" />
                            </div>
                        </li>
                        <li>
                            <p className="field">Name:</p>
                            <p className="value">abc</p>
                        </li>
                        <li>
                            <p className="field">Transactions:</p>
                            <p className="value">120.211</p>
                        </li>
                        <li>
                            <p className="field">Transfer:</p>
                            <div className="value">
                                <p>10000 (</p>
                                <img alt="photos" src={IconDown} style={{marginRight: '5px'}}></img>
                                <p> 2000 </p>
                                <img alt="photos" src={IconUp} style={{marginRight: '5px', marginLeft: '5px'}}></img>
                                <p>8000)</p>
                            </div>
                        </li>
                        <li>
                            <p className="field">TRON Power:</p>
                            <p className="value">7 (Used: 7    Available:0)</p>
                        </li>
                        <li>
                            <p className="field">Total balance:</p>
                            <p className="value">27.737788 EM (0.606 USD)</p>
                        </li>
                    </ul>
                    <div className="group-right">
                        <div className="waper-circular" style={{marginBottom: '55px'}}>
                            <div className="circular">
                                <CircularProgressbarWithChildren value={10} strokeWidth={15}>
                                </CircularProgressbarWithChildren>
                            </div>
                            <div className="text">
                                <p>Available Banwidth</p>
                                <p>1250</p>
                            </div>
                        </div>
                        <div className="waper-circular">
                            <div className="circular circular2">
                                <CircularProgressbarWithChildren value={60} strokeWidth={15}>
                                </CircularProgressbarWithChildren>
                            </div>
                            <div className="text">
                                <p>Available Energy</p>
                                <p>226</p>
                            </div>
                        </div>
                    </div>
                    
                </div>
            </div>
        )
    }

    renderListToken() {
        return (
            <div className="list-token">
                <div className="waper-button">
                    <button className="active" onClick={(e) => this.onClickButton(e)}>TOKEN BALANCE</button>
                    <button onClick={(e) => this.onClickButton(e)}>TRANSFERS</button>
                    <button onClick={(e) => this.onClickButton(e)}>TRANSACTION</button>
                    <button onClick={(e) => this.onClickButton(e)}>INTERNAL TRANSACTIONS</button>
                </div>
                <ul className="menu-general-2">
                    {this.state.data.map((value, index) => {
                            if (index > 0) {
                                return (
                                    <li key={index}>
                                        <div className="token">
                                            <img alt="photos" src={LogoTron}></img>
                                            <p>{value.token}</p>
                                        </div>
                                        <p className="token-type">TRC 10</p>
                                        <p className="id">1002000</p>
                                        <p className="precision">6</p>
                                        <p className="balance">1.25</p>
                                        <p className="price">0.0355</p>
                                        <div className="value">
                                            <p>1.25 TRX</p>
                                            <p>0.027 USD</p>
                                        </div>
                                    </li>
                                )
                            } else {
                                return (<li key={index}>
                                            <h1 className="token">Token</h1>
                                            <h1 className="token-type">Token type</h1>
                                            <h1 className="id">ID</h1>
                                            <h1 className="precision">Precision</h1>
                                            <h1 className="balance">Balance</h1>
                                            <h1 className="price">Price(TRX)</h1>
                                            <h1 className="value">Value</h1>
                                        </li>
                                )
                            }
                        })}
                </ul>
                <div className="waper-page">
                        <button className={this.state.page === 1 ? 'active' : ''} onClick={() => this.onClickPage(1)}>1</button>
                        <button className={this.state.page === 2 ? 'active' : ''} onClick={() => this.onClickPage(2)}>2</button>
                    </div>
            </div>
        )
    }

    render() {
        return (
            <div className="bg-general" id="tron-address">
                <Headers/>
                <div className="container">
                    {this.renderAds()}
                    {this.renderAddress()}
                    {this.renderListToken()}
                </div>
                <Fooder/>
            </div>
        )
    }
}

export default TronAddressController;