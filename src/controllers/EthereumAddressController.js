import React, {Component} from 'react'
import Headers from '../components/Header';
import Fooder from '../components/Fooder';
import ButtonCopy from '../components/ButtonCopy';
import IconCopy from '../assets/images/icon-copy.svg'
import IconDownArrow from '../assets/images/icon-ddl.svg'
import Ads from '../assets/images/ads.svg'
import $ from "jquery"
import LogoEthereum from '../assets/images/logo-ethereum.svg'
import ServerAPI from '../ServerAPI';
import moment from 'moment';
import LoadingIcon from '../assets/images/loading.svg'
import { Redirect } from 'react-router-dom';

class EthereumAddressController extends Component {

    constructor(props) {
        super(props);

        this.state = {
            showListToken: false,
            key: '',
            page: 1,
            pageSize: 20,
            totalPage: 1,
            address: this.getAddress(),
            txList: [],
            addressInfo: [],
            loading: false,
            error: false,
            ethPrice: 0,
            totalUsdAmount: 0
        }
    };

    getAddress() {
        if (this.props.match && this.props.match.params) {
            return this.props.match.params.address
        }

        return '';
    }

    async componentDidMount() {
        if (!this.state.address) {
            return;
        }

        ServerAPI.getAddressInfo(this.state.address).then(res => {
            var totalUsdAmount = 0;
            if (res.tokens) {
                for (let i = 0; i < res.tokens.length; i++) {
                    var tokenAmount = res.tokens[i].balance / 10**res.tokens[i].tokenInfo.decimals;
                    res.tokens[i].tokenAmount = tokenAmount;
                    res.tokens[i].usdAmount = res.tokens[i].tokenInfo.price ? (res.tokens[i].tokenInfo.price.rate * tokenAmount).toFixed(2) : 0;
                    totalUsdAmount += parseFloat(res.tokens[i].usdAmount);
                }
            }

            var addressInfo = {
                token: res.tokens,
                balance: res.ETH ? res.ETH.balance : 0
            };

            this.setState({
                totalUsdAmount: totalUsdAmount.toFixed(2),
                addressInfo,
                totalPage:  Math.ceil(res.countTxs/this.state.pageSize),
            })
        })

        ServerAPI.getETHprice().then(res => {
            this.setState({
                ethPrice: res.ethereum ? res.ethereum.usd : 0 
            })
        })
       
        this.loadTxList(1);
        
    }

    loadTxList = (page) => {
        this.setState({
            loading: true
        })
        ServerAPI.getTxList(this.state.address, page, this.state.pageSize).then(res => {
            if (res.status === '1') {
                this.setState({
                    page,
                    txList: res.result,
                    loading: false
                })
            }

            if (res.status === '0') {
                this.setState({
                    page,
                    txList: [],
                    loading: false,
                    error: res.result
                })
            }
        });
    }

    startPage = () => {
        this.loadTxList(1);
    }

    endPage = () => {
        this.loadTxList(this.state.totalPage);
    }

    onClickPage = (index) => {
        this.loadTxList(index);
    }

    onClickButton = (e) => {
        $(".waper-button button").removeClass("active");
        $(e.target).addClass("active");
    }

    onClickButtonToken = () => {
        this.setState({
            showListToken: !this.state.showListToken
        })
    }

    filterToken = (e) => {
        this.setState({
            key: e.target.value
        })
    }

    renderToken () {
        return (
            <ul className="waper-token">
                <div>
                    <input placeholder="Search for Token Name" onChange={(e) => this.filterToken(e)}></input>
                </div>
                <div className="title-token">
                    <p>ERC-20 Tokens (70)</p>
                </div>
                <div className="scroll">
                    {this.state.addressInfo.token.map((value, index) => {
                        if (value.tokenInfo.name.toLowerCase().indexOf(this.state.key.toLowerCase()) >= 0 || value.tokenInfo.symbol.toLowerCase().indexOf(this.state.key.toLowerCase()) >= 0) {
                            return (<li>
                                <div className="child-left">
                                    <img style={ {height: '20px', verticalAlign: '10px'} } src={value.tokenInfo.image || LogoEthereum } alt="photos"></img>
                                    <div>
                                        <p>{value.tokenInfo.name} ({value.tokenInfo.symbol})</p>
                                        <p>{value.tokenAmount} {value.tokenInfo.symbol}</p>
                                    </div>
                                </div>

                                <div className="child-right">
                                    <p>${value.usdAmount}</p>
                                    <p>{value.tokenInfo.price ? (value.tokenInfo.price.rate * value.tokenAmount / this.state.ethPrice).toFixed(8) : 0}</p>
                                </div>
                            </li>)
                        }

                        return '';
                    })}
                </div>
            
        </ul>
        )
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
                    <div className="logo-circle logo-ethereum">
                        <img alt="photos" src={LogoEthereum}></img>
                    </div>
                    <p>ADDRESS</p>
                </div>
                <div className="content">
                    <ul className="menu-general">
                        <li>
                            <p className="field">Address:</p>
                            <div className="value">
                                <p style={{marginRight: '5px'}}>{this.state.address}</p>
                                <ButtonCopy copyIcon={IconCopy} copyText={this.state.address} />
                            </div>
                        </li>
                        <li>
                            <p className="field">ETHER Value:</p>
                            <p className="value">${(this.state.addressInfo.balance * this.state.ethPrice).toFixed(2)} (${this.state.ethPrice} / ETH)</p>
                        </li>
                        <li>
                            <p className="field">Total balance:</p>
                            <p className="value">{this.state.addressInfo.balance} Ether</p>
                        </li>
                        {(this.state.addressInfo && this.state.addressInfo.token) && <li>
                            <p className="field">Token:</p>
                            <div className="token">
                                <button onClick={this.onClickButtonToken}>
                                    ${this.state.totalUsdAmount} ({this.state.addressInfo.token.length})
                                    <img src={IconDownArrow} alt="photos"></img>
                                </button>
                                {this.state.showListToken && this.renderToken()}
                            </div>
                        </li>}
                    </ul>
                </div>
            </div>
        )
    }

    renderListToken() {
        return (
            <div className="list-token">
                {/* <div className="waper-button">
                    <button className="active" onClick={(e) => this.onClickButton(e)}>Transactions</button>
                    <button onClick={(e) => this.onClickButton(e)}>Token Txns</button>
                    <button onClick={(e) => this.onClickButton(e)}>Transfer</button>
                </div> */}
                
                <ul className="menu-general-2">
                    {this.state.loading && <div style={{textAlign: 'center'}}>
                        <img src={LoadingIcon} alt="photos"/>
                    </div>}
                    { this.state.error && <div className="alert">{this.state.error}</div> }
                    <li>
                        <h1 className="with-big">Txn Hash</h1>
                        <h1 className="with-small">Block</h1>
                        <h1>Age</h1>
                        <h1 className="with-big">From</h1>
                        <h1 className="with-small"> </h1>
                        <h1 className="with-big">To</h1>
                        <h1 style={{width: '100px'}}>Value</h1>
                        <h1 style={ {width: 80} }>Txn Fee</h1>
                    </li>
                    {!this.state.loading && this.state.txList.map((value, index) => {
                            return (
                                <li key={index}>
                                    <p className="with-big"><a href={`/ethereum/tx/${value.hash}`} target="_blank" rel="noopener noreferrer">{value.hash.substring(0,20) + '...'}</a></p>
                                    <p className="with-small">{value.blockNumber}</p>
                                    <p>{moment(value.timeStamp  * 1000).fromNow()}</p>
                                    { value.from === this.state.address.toLowerCase() ? <p className="with-big">{value.from.substring(0,20) + '...'}</p> : <p className="with-big"><a href={`/ethereum/address/${value.from}`} target="_blank" rel="noopener noreferrer">{value.from.substring(0,20) + '...'}</a></p>}
                                    <p className="label with-small">{value.from.toLowerCase() === this.state.address.toLowerCase() ? "OUT" : "IN"}</p>
                                    { value.to === this.state.address.toLowerCase() ? <p className="with-big">{value.to.substring(0,20) + '...'}</p> : <p className="with-big"><a href={`/ethereum/address/${value.to}`} target="_blank" rel="noopener noreferrer">{value.to.substring(0,20) + '...'}</a></p>}
                                    <p style={{width: '100px'}}>{(value.value / 10**18).toString().substring(0,8)} Ether</p>
                                    <p style={ {width: 80} }>{(value.gasUsed * (value.gasPrice / 10**18)).toString().substring(0,9)}</p>
                                </li>
                            )
                        })}
                </ul>
                <div className="group-page">
                    <button onClick={() => this.startPage()} className="pre">Start</button>
                    <div className="waper-page">
                        {this.state.page > 1 && <button onClick={() => this.onClickPage(this.state.page - 1)}>{this.state.page - 1}</button>}
                        <button className="active" onClick={() => this.onClickPage(this.state.page)}>{this.state.page}</button>
                        {this.state.totalPage >= this.state.page + 1 && <button className={this.state.page === this.state.page + 1 ? 'active' : ''} onClick={() => this.onClickPage(this.state.page + 1)}>{this.state.page + 1}</button>}
                        {this.state.totalPage > this.state.page + 2 && <p>...</p>}
                        {this.state.totalPage >= this.state.page + 2 && <button className={this.state.page === this.state.totalPage ? 'active' : ''} onClick={() => this.onClickPage(this.state.totalPage)}>{this.state.totalPage}</button>}
                    </div>
                    <button onClick={() => this.endPage()} className="next">End</button>
                </div>
            </div>
        )
    }

    renderEthereumAddress() {
        return (
            <div className="bg-general" id="ethereum-address">
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

    render () {
        if (!this.state.address) {
            return <Redirect to={{
                pathname : '/',
            }} />
        } else {
            return this.renderEthereumAddress()
        }
    }
}

export default EthereumAddressController;