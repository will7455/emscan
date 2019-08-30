import React, { Component } from 'react'
import Headers from '../components/Header';
import Fooder from '../components/Fooder';
import ButtonCopy from '../components/ButtonCopy';
import IconCopy from '../assets/images/icon-copy.svg'
import IconLoading from '../assets/images/loading.svg'
import Ads from '../assets/images/ads.svg'
import ServerAPI from '../ServerAPI'
import moment from 'moment'

class EthereumTransactionController extends Component {

    constructor(props) {
        super(props);

        this.state = {
            file: null,
            txHash: props.match.params.txHash,
            info: false,
            gasInfo: false,
            toInfo: false,
            ethPrice: 0
        }
    }

    getTxInfo() {
        const { txHash } = this.state
        const _this = this;
        ServerAPI.getEthereumTxInfo(txHash).then(info => {
            this.setState({
                info
            })

            if (info.to) {
                ServerAPI.getAddressInfo(info.to).then(toInfo => {
                    this.setState({
                        toInfo
                    })
                })
            }


            if (!info.timestamp) {
                setTimeout(() => {
                    _this.getTxInfo()
                }, 5000)
            }
        })

        ServerAPI.getEthereumTxGasInfo(txHash).then(res => {
            this.setState({
                gasInfo: res.result
            })
        })

        ServerAPI.getETHprice().then(res => {
            this.setState({
                ethPrice: res.ethereum.usd
            })
        })
    }

    componentDidMount() {
        this.getTxInfo()
    }

    renderAds() {
        return (
            <div className="ads">
                <img alt="photos" src={Ads}></img>
            </div>
        )
    }

    render() {

        const { txHash, info, gasInfo, toInfo, ethPrice } = this.state

        return (
            <div className="bg-general" id="ethereum-transaction">
                <Headers />
                <div className="container">
                    {this.renderAds()}
                    <ul className="menu-general">
                        <li>
                            <h1>TRANSACTION</h1>
                        </li>
                        <li>
                            <h1>#Hash: {txHash}</h1>
                        </li>
                        <li>
                            <p className="field">Status:</p>
                            {info.success === true && <button className="button">CONFIRMED</button>}
                            {info.success === false && <button className="button bg-error">ERROR</button>}
                            {info.success === null && <button className="button bg-warning" style={{ textAlign: 'left' }}><img style={{ height: 33, verticalAlign: 'middle' }} src={IconLoading} alt="photos"/> PENDING</button>}
                        </li>

                        {info.blockNumber &&
                            <li>
                                <p className="field">Block:</p>
                                <div className="value">
                                    <p>{info.blockNumber}</p>
                                    <span className="label">{info.confirmations} Block confirmation</span>
                                </div>
                            </li>
                        }

                        {
                            info.timestamp &&
                            <li>
                                <p className="field">Timestamp:</p>
                                <p className="value">{moment(info.timestamp * 1000).fromNow()} ({moment(info.timestamp * 1000).format("MMM-D-YYYY h:mm:ss A")})</p>
                            </li>
                        }

                        {info.from &&
                            <li>
                                <p className="field">From:</p>
                                <div className="value">
                                    <a href={`/ethereum/address/${info.from}`} target="_blank" rel="noopener noreferrer">{info.from}</a>
                                    <ButtonCopy copyIcon={IconCopy} copyText={info.from} />
                                </div>
                            </li>
                        }

                        {info.to &&
                            <li>
                                <p className="field">To:</p>
                                <div className="value">
                                    <p>{(toInfo && toInfo.contractInfo) && 'Contract: '} <a  href={`/ethereum/address/${info.to}`} target="_blank" rel="noopener noreferrer">{info.to}</a> {(toInfo && toInfo.tokenInfo) && `(${toInfo.tokenInfo.name})`}</p>
                                    <ButtonCopy copyIcon={IconCopy} copyText={info.to} />
                                </div>
                            </li>
                        }
                        {
                            (info.operations && info.operations.length > 0) &&
                            <li>
                                <p className="field">Tokens Transferred:</p>
                                <div className="token-transfer">
                                    {info.operations.map((value, index) => {
                                        return (
                                            <p key={index} className="value">
                                                From <a style={ { width: 180,marginLeft:5 } } href={`/ethereum/address/${value.from}`} target="_blank" rel="noopener noreferrer">{value.from.substring(0, 20) + '...'}</a> 
                                                To <a style={ { width: 180,marginLeft:5 } } href={`/ethereum/address/${value.to}`} target="_blank" rel="noopener noreferrer">{value.to.substring(0, 20) + '...'}</a> 
                                                For: {value.intValue / 10 ** value.tokenInfo.decimals} {value.tokenInfo.price && `($${(value.intValue / 10 ** value.tokenInfo.decimals * value.tokenInfo.price.rate).toFixed(2)})`} 
                                                <span className="color" style={{ marginLeft: '3px' }}><img style={{ height: 12 }} src={value.tokenInfo.image} alt="photos"/>{value.tokenInfo.name} ({value.tokenInfo.symbol})</span>
                                            </p>
                                        )
                                    })}
                                </div>
                            </li>
                        }


                        {gasInfo &&
                            <React.Fragment>
                                <li>
                                    <p className="field">Value:</p>
                                    <div className="value">
                                        <span className="label">{info.value} Ether</span>
                                        <p>(${(info.value * ethPrice).toFixed(2)})</p>
                                    </div>
                                </li>
                                <li>
                                    <p className="field">Transaction Fee:</p>
                                    <p className="value">{info.gasUsed * (parseInt(gasInfo.gasPrice) / 10 ** 18)} Ether ($0.05)</p>
                                </li>
                                <li>
                                    <p className="field">Gas Limit:</p>
                                    <p className="value">{info.gasLimit}</p>
                                </li>
                                <li>
                                    <p className="field">Gas Used by Transaction:</p>
                                    <p className="value">{info.gasUsed} ({(info.gasUsed / info.gasLimit * 100).toFixed(2)}%)</p>
                                </li>
                                <li>
                                    <p className="field">Gas Price:</p>
                                    <p className="value">{(parseInt(gasInfo.gasPrice) / 10 ** 18).toFixed(9)} Ether ({parseInt(gasInfo.gasPrice) / 10 ** 9} Gwei)</p>
                                </li>
                            </React.Fragment>
                        }
                    </ul>
                </div>
                <Fooder />
            </div>
        )
    }
}

export default EthereumTransactionController;