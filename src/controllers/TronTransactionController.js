import React, {Component} from 'react'
import Headers from '../components/Header';
import Fooder from '../components/Fooder';
import ButtonCopy from '../components/ButtonCopy';
import IconCopy from '../assets/images/icon-copy.svg'
import Icon1 from '../assets/images/import-export-arrows.svg'
import Ads from '../assets/images/ads.svg'

class TronTransactionController extends Component {

    constructor(props) {
        super(props);

        this.state = {
            file: null
        }
    };

    renderAds() {
        return (
            <div className="ads">
                <img alt="photos" src={Ads}></img>
            </div>
        )
    }

    render() {
        return (
            <div className="bg-general" id="tron-transaction">
                <Headers/>
                <div className="container">
                    {this.renderAds()}
                    <ul className="menu-general">
                        <li>
                            <h1>TRANSACTION</h1>
                        </li>
                        <li>
                            <h1>#Hash 1763c2d545b863c06898b21a3226f901e660034b1c0224007680ea8be7975445</h1>
                        </li>
                        <li>
                            <p className="field">Status:</p>
                            <button className="button">Submit Your Dapp</button>
                        </li>
                        <li>
                            <p className="field">Result:</p>
                            <div className="value">
                                <p>0000000000ae1484454ffcc617f4ee454509e6c83b911b8f91e1bc51f7e7c76f</p>
                                <ButtonCopy copyIcon={IconCopy} copyText="0000000000ae1484454ffcc617f4ee454509e6c83b911b8f91e1bc51f7e7c76f" />
                            </div>
                        </li>
                        <li>
                            <p className="field">Hash:</p>
                            <p className="value">11.408.516</p>
                        </li>
                        <li>
                            <p className="field">Block:</p>
                            <p className="value">7/30/2019 10:20:09</p>
                        </li>
                        <li>
                            <p className="field">Time:</p>
                            <p className="value">110 transactions</p>
                        </li>
                    </ul>

                    <ul className="menu-general" style={{marginBottom: '60px'}}>
                        <li>
                            <div className="field">
                                <img alt="photos" src={Icon1}></img>
                                <p>Transfer Asset Contract</p>
                            </div>
                            <p className="text">Token transfer between address</p>
                        </li>
                        <li>
                            <p className="field">From:</p>
                            <div className="value">
                                <p>454ffcc617f4ee454509e6c8</p>
                                <ButtonCopy copyIcon={IconCopy} copyText="454ffcc617f4ee454509e6c8" />
                            </div>
                        </li>
                        <li>
                            <p className="field">To:</p>
                            <div className="value">
                                <p>454ffcc617f4ee454509e6c8</p>
                                <ButtonCopy copyIcon={IconCopy} copyText="454ffcc617f4ee454509e6c8" />
                            </div>
                        </li>
                        <li>
                            <p className="field">Amount:</p>
                            <p className="value">1</p>
                        </li>
                        <li>
                            <p className="field">Token:</p>
                            <p className="value">TXW</p>
                        </li>
                        <li>
                            <p className="field">Time:</p>
                            <p className="value">110 transactions</p>
                        </li>
                    </ul>
                  
                </div>
                <Fooder/>
            </div>
        )
    }
}

export default TronTransactionController;