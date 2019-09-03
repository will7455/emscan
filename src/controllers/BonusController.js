import React, { Component } from 'react'
import Headers from '../components/Header';
import Fooder from '../components/Fooder';
import Button from '../components/Button';
import Select from 'react-select'
import LogoTron from '../assets/images/logo-tron.svg'
import LogoEthereum from '../assets/images/logo-ethereum.svg'
import $ from "jquery"
import ServerAPI from '../ServerAPI';
import LoadingIcon from '../assets/images/loading.svg'
import Web3EthContract from 'web3-eth-contract'
import Web3Utils from 'web3-utils'
import { CONTRACT_ADDRESS, API_ENDPOINT, MAX_APPROVE } from '../constants/index'
import bonusABI from '../constants/bonus.abi.json'
import erc20ABI from '../constants/erc20.abi.json'
import ArrowLeft from '../assets/images/arrow-left.svg'
import ArrowRight from '../assets/images/arrow-right.svg'

class BonusController extends Component {

    constructor(props) {
        super(props);

        this.state = {
            page: 1,
            pageSize: 5,
            totalPage: 1,
            listDapp: false,
            protocol: [
                { label: this.renderSelect(LogoEthereum, "ETHEREUM"), value: 1 },
                { label: this.renderSelect(LogoTron, "TRON"), value: 2 },
                { label: this.renderSelect(LogoEthereum, "USDT ERC20"), value: 3 },
                { label: this.renderSelect(LogoTron, "USDT TRC20"), value: 4 },
            ],
            defaultProtocolValue: { label: this.renderSelect(LogoEthereum, "ETHEREUM"), value: 1 },
            showBonus: true,
            showHistory: false,
            loading: false,
            fullname: props.location && props.location.state ? props.location.state.fullname : null,
            amountReward: props.location && props.location.state ? props.location.state.amountReward : 0,
            payLoading: false,
            payError: false,
            paySuccess: false,
            currentDapp: props.location && props.location.state ? props.location.state.currentDapp : null,
            amount: 1,
            amountBonus: 5,
            empowPrice: false,
            coinPrice: false,
            history: []
        }

        
    };

    async componentDidMount() {
       
        if (this.state.currentDapp) {
            ServerAPI.getCountDappBonus(this.state.currentDapp.id).then(count => {
                this.setState({
                    totalPage: Math.ceil(count / this.state.pageSize)
                })
            })

            this.loadHistory(this.state.currentDapp.id, 1);
        }

        ServerAPI.getPrice('empow').then(empowPrice => {
            this.setState({
                empowPrice
            })
        })

        ServerAPI.getCoinPrice().then(res => {

            let coinPrice = [
                res.ethereum.usd,
                res.tron.usd,
                res.tether.usd,
                res.tether.usd
            ]

            this.setState({
                coinPrice
            })
        })
    }

    componentDidUpdate() {
        $('.option').children('.right').remove();
    }

    callEthereumTransaction(transaction, callback = false) {
        window.web3.eth.call(transaction, callback)
    }

    sendEthereumTransaction(transaction, callback = false) {
        window.web3.eth.sendTransaction(transaction, callback)
    }

    async payWithEthereum(address) {

        const { currentDapp, amount, amountBonus } = this.state

        const contractInstance = new Web3EthContract(bonusABI, CONTRACT_ADDRESS.EMPOW_ETHEREUM_BONUS)
        const data = await contractInstance.methods.bonus(currentDapp.id, parseInt(amountBonus * 10 ** 6)).encodeABI()
        const transaction = {
            from: address,
            to: CONTRACT_ADDRESS.EMPOW_ETHEREUM_BONUS,
            value: Web3Utils.toWei(amount.toString()),
            data
        }

        this.sendEthereumTransaction(transaction, (error, res) => {
            if (error) {
                return this.setState({
                    payLoading: false,
                    payError: error.message ? error.message : error
                })
            }
            this.setState({
                payLoading: false,
                paySuccess: 'Set bonus successfully'
            })
        })
    }

    async payWithUsdtErc20(address) {
        const { currentDapp, amount, amountBonus } = this.state

        // check approve
        let usdtContractInstance = new Web3EthContract(erc20ABI, CONTRACT_ADDRESS.USDT_ERC20)
        let empowBonusContractInstance = new Web3EthContract(bonusABI, CONTRACT_ADDRESS.EMPOW_ETHEREUM_BONUS)
        let data = await usdtContractInstance.methods.allowance(address, CONTRACT_ADDRESS.EMPOW_ETHEREUM_BONUS).encodeABI()
        let transaction = {
            from: address,
            to: CONTRACT_ADDRESS.USDT_ERC20,
            data
        }

        this.callEthereumTransaction(transaction, async (error, res) => {
            if (error) {
                return this.setState({
                    payLoading: false,
                    payError: error.message ? error.message : error
                })
            }

            const allowance = Web3Utils.hexToNumberString(res)

            if (allowance !== MAX_APPROVE) {
                data = usdtContractInstance.methods.approve(CONTRACT_ADDRESS.EMPOW_ETHEREUM_BONUS, MAX_APPROVE).encodeABI()

                transaction = {
                    from: address,
                    to: CONTRACT_ADDRESS.USDT_ERC20,
                    data
                }

                this.sendEthereumTransaction(transaction, (error, res) => {
                    if (error) {
                        return this.setState({
                            payLoading: false,
                            payError: error.message ? error.message : error
                        })
                    }

                    data = empowBonusContractInstance.methods.bonusWithUsdt(currentDapp.id, parseInt(amountBonus * 10 ** 6), parseInt(amount * 10 ** 6)).encodeABI()

                    transaction = {
                        from: address,
                        to: CONTRACT_ADDRESS.EMPOW_ETHEREUM_BONUS,
                        data
                    }

                    this.sendEthereumTransaction(transaction, (error, res) => {
                        if (error) {
                            return this.setState({
                                payLoading: false,
                                payError: error.message ? error.message : error
                            })
                        }

                        this.setState({
                            payLoading: false,
                            paySuccess: 'Set bonus successfully'
                        })
                    })
                })

            } else {
                data = empowBonusContractInstance.methods.bonusWithUsdt(currentDapp.id, parseInt(amountBonus * 10 ** 6), parseInt(amount * 10 ** 6)).encodeABI()

                transaction = {
                    from: address,
                    to: CONTRACT_ADDRESS.EMPOW_ETHEREUM_BONUS,
                    data
                }

                this.sendEthereumTransaction(transaction, (error, res) => {
                    if (error) {
                        return this.setState({
                            payLoading: false,
                            payError: error.message ? error.message : error
                        })
                    }

                    this.setState({
                        payLoading: false,
                        paySuccess: 'Set bonus successfully'
                    })
                })
            }


        })
    }

    async payWithTron () {

        const { currentDapp, amount, amountBonus } = this.state

        const contractInstance = await window.tronWeb.contract().at(CONTRACT_ADDRESS.EMPOW_TRON_BONUS)
        try {
            await contractInstance.bonus(currentDapp.id, parseInt(amountBonus * 10 ** 6)).send({shouldPollResponse: true,callValue: amount * 10**6})
            this.setState({
                payLoading: false,
                paySuccess: 'Set bonus successfully'
            })
        } catch (error) {
            return this.setState({
                payLoading: false,
                payError: error.message ? error.message : error
            })
        }
    }

    async payWithUsdtTrc20 (address) {
        const { currentDapp, amount, amountBonus } = this.state

        const tronContractInstance = await window.tronWeb.contract().at(CONTRACT_ADDRESS.EMPOW_TRON_BONUS)
        const usdtContractInstance = await window.tronWeb.contract().at(CONTRACT_ADDRESS.USDT_TRC20)

        // check approve
        const allowance = await usdtContractInstance.allowance(address, CONTRACT_ADDRESS.EMPOW_TRON_BONUS).call()

        if(allowance.remaining.toString() !== MAX_APPROVE) {
            try {
                await usdtContractInstance.approve(CONTRACT_ADDRESS.EMPOW_TRON_BONUS, MAX_APPROVE).send({shouldPollResponse: true,callValue: 0})
            } catch (error) {
                return this.setState({
                    payLoading: false,
                    payError: error.message ? error.message : error
                })
            }
        }

        // set bonus
        try {
            await tronContractInstance.bonusWithUsdt(currentDapp.id, parseInt(amountBonus * 10 ** 6), parseInt(amount * 10**6)).send({shouldPollResponse: true,callValue: 0})
            this.setState({
                payLoading: false,
                paySuccess: 'Set bonus successfully'
            })
        } catch (error) {
            return this.setState({
                payLoading: false,
                payError: error.message ? error.message : error
            })
        }
    }

    onPay = async (e) => {

        e.preventDefault()

        const { defaultProtocolValue, currentDapp } = this.state
        let address = false

        if(!currentDapp) {
            return this.setState({ payError: 'Please select DApp to set bonus' })
        }

        if(defaultProtocolValue.value === 1 || defaultProtocolValue.value === 3) {
            if (!window.ethereum) return this.setState({ error: 'Please install Empow Wallet extension first' })
            address = await window.ethereum.enable()
            if (!address || address.length === 0) return this.setState({ error: 'Please unlock your wallet' })
        }

        if(defaultProtocolValue.value === 2 || defaultProtocolValue.value === 4) {
            if(!window.tronWeb) return this.setState({ error: 'Please install Empow Wallet extension first' })
            if(!window.tronWeb.defaultAddress)  return this.setState({ error: 'Please unlock your wallet' })
            address = window.tronWeb.defaultAddress.base58
        }

        this.setState({
            payLoading: true,
            payError: false,
            paySuccess: false
        })

        // ETHEREUM
        if (defaultProtocolValue.value === 1) {
            this.payWithEthereum(address[0])
        }
        // USDT ERC20
        if (defaultProtocolValue.value === 3) {
            this.payWithUsdtErc20(address[0])
        }
        // TRON
        if(defaultProtocolValue.value === 2) {
            this.payWithTron()
        }
        // USDT TRC20
        if(defaultProtocolValue.value === 4) {
            this.payWithUsdtTrc20(address)
        }
    }

    handleChangeSelect = (value) => {
        this.setState({
            defaultValue: value
        })
    }

    handleChangeSelectProtocol = (value) => {
        this.setState({
            defaultProtocolValue: value
        })
    }

    onClickMenu = (e, index) => {
        $(".menu div").removeClass("active");
        $(e.target).addClass("active");

        if (index === 1) {
            this.setState({
                showBonus: true,
                showHistory: false
            })
        }

        if (index === 2) {
            this.setState({
                showHistory: true,
                showBonus: false
            })
        }
    }

    upPage = () => {
        var page = this.state.page + 1 > this.state.totalPage ? this.state.page : this.state.page + 1;
        this.loadHistory(this.state.currentDapp.id, page);
    }

    downPage = () => {
        var page = this.state.page - 1 < 1 ? 1 : this.state.page - 1;
        this.loadHistory(this.state.currentDapp.id, page);
    }

    handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            if (!e.target.value || e.target.value.trim() === '') {
                this.setState({
                    listDapp: false,
                    loading: false
                })
                return;
            }

            this.setState({
                loading: true
            })

            ServerAPI.getDAppByKey(e.target.value)
                .then(res => {
                    if (this.state.currentDapp) {
                        res = res.filter(x => x.id !== this.state.currentDapp.id);
                    }
                    this.setState({
                        listDapp: res,
                        loading: false
                    })
                });
        }
    }

    selectSearchResult = async (value) => {
        $(".waper-search input").val(null);
        var count = await ServerAPI.getCountDappBonus(value.id)
        this.setState({
            currentDapp: value,
            listDapp: false,
            totalPage: Math.ceil(count / this.state.pageSize),
            page: 1
        })
        await this.loadHistory(value.id, 1);
    }

    loadHistory = async (dappId, page) => {
        ServerAPI.getDappBonus(dappId, page, this.state.pageSize).then(history => {
            this.setState({
                history,
                page
            })
        })
    }

    renderSelect(logo, name) {
        return (
            <div className="option">
                <img src={logo} alt="photos" />
                <p>{name}</p>
            </div>
        )
    }

    renderSetBonus() {
        return (
            <div>
                <div className="set-bonus">
                    {this.state.payError && <div className="alert">{this.state.payError}</div>}
                    {this.state.paySuccess && <div className="alert alert-success">{this.state.paySuccess}</div>}
                    <div className="waper">
                        <div className="child">
                            <div className="group">
                                <p style={{width: '30%'}}>Protocol</p>
                                <p style={{width: '70%', textAlign: 'right'}}>Total {this.state.defaultProtocolValue.value === 1 ? 'ETH' : this.state.defaultProtocolValue.value === 2 ? 'TRX' : 'USDT'}</p>
                            </div>
                            <div className="group">
                                <div className="select-general">
                                    <Select className="react-select-container" classNamePrefix="react-select"
                                        isSearchable={false}
                                        options={this.state.protocol}
                                        value={this.state.defaultProtocolValue}
                                        onChange={(value) => this.handleChangeSelectProtocol(value)}
                                    />
                                </div>
                                <div className="child-child">
                                    <input defaultValue={1} type="number" name="amount" onBlur={(e) => this.setState({ [e.target.name]: e.target.value })}></input>
                                    <span>
                                        <p>{this.state.defaultProtocolValue.value === 1 ? 'ETH' : this.state.defaultProtocolValue.value === 2 ? 'TRX' : 'USDT'}</p>
                                    </span>
                                </div>
                            </div>

                        </div>

                        <div className="child">
                            <p>Amount Bonus</p>
                            <div className="child-child">
                                <input defaultValue={this.state.amountBonus} name="amountBonus" type="number" onBlur={(e) => this.setState({ [e.target.name]: e.target.value })}></input>
                                <span>
                                    <p>EM/transaction</p>
                                </span>
                            </div>
                        </div>

                    </div>
                    <div className="waper">
                        <div className="child">
                            <p>Total USD</p>
                            <div className="child-child">
                                <input value={this.state.amount * this.state.coinPrice[this.state.defaultProtocolValue.value - 1]} type="number"></input>
                                <span>
                                    <p>USD</p>
                                </span>
                            </div>
                        </div>

                        <div className="child">
                            <p>Total EM</p>
                            <div className="child-child">
                                <input value={(this.state.amount * this.state.coinPrice[this.state.defaultProtocolValue.value - 1]) / this.state.empowPrice} type="number"></input>
                                <span>
                                    <p>EM</p>
                                </span>
                            </div>
                        </div>
                    </div>
                    <div style={{ textAlign: 'center' }}>
                        <Button isLoading={this.state.payLoading} onClick={(e) => this.onPay(e)}>Pay</Button>
                    </div>
                </div>
                <p style={{ textAlign: 'center' }}>The total number of tokens you can buy can only be used to reward Dapp users. You will not be able to use it for other purposes.</p>
            </div>
        )
    }

    renderHistoryScreen768() {
        return (
            <div className="history screen-768">
            <ul className="content">
                {this.state.history.map((value, index) => {
                    return (<li key={index}>
                        <div className="child">
                            <p>Time</p>
                            <p>{value.created_at[0].slice(0, 19).replace('T', ' ')}</p>
                        </div>
                        <div className="child">
                            <p>Total Pay</p>
                            <p>{value.pay_amount} {value.blockchain_type === 'ethereum' ? 'ETH' : value.blockchain_type === 'tron' ? 'TRX' : 'USDT'}</p>
                        </div>
                        <div className="child">
                            <p>Buuyer</p>
                            <p>{value.email}</p>
                        </div>
                        <div className="child">
                            <p>Total Buy</p>
                            <p>{value.total_amount} EM</p>
                        </div>
                    </li>)
                })}
            </ul>
            <div className="waper-page">
                {(this.state.page > 1) && <button onClick={() => this.downPage()}>
                    <img src={ArrowLeft} alt="photos"></img>
                </button>}
                {(this.state.page !== this.state.totalPage) && <button onClick={() => this.upPage()}>
                    <img src={ArrowRight} alt="photos"></img>
                </button>}
            </div>
        </div>
        )
    }

    renderHistory() {
        return (
            <div className="history screen-normal">
                <ul className="content">
                    <li className="title">
                        <p className="time">Time</p>
                        <p className="total-pay">Total Pay</p>
                        <p className="buyer">Buyer</p>
                        <p className="total-buy">Total buy</p>
                    </li>
                    {this.state.history.map((value, index) => {
                        return (<li key={index}>
                            <p className="time">{value.created_at[0].slice(0, 19).replace('T', ' ')}</p>
                            <p className="total-pay">{value.pay_amount} {value.blockchain_type === 'ethereum' ? 'ETH' : value.blockchain_type === 'tron' ? 'TRX' : 'USDT'}</p>
                            <p className="buyer">{value.email}</p>
                            <p className="total-buy">{value.total_amount} EM</p>
                        </li>)
                    })}
                </ul>
                <div className="waper-page">
                    {(this.state.page > 1) && <button onClick={() => this.downPage()}>
                        <img src={ArrowLeft} alt="photos"></img>
                    </button>}
                    {(this.state.page !== this.state.totalPage) && <button onClick={() => this.upPage()}>
                        <img src={ArrowRight} alt="photos"></img>
                    </button>}
                </div>
            </div>
        )
    }

    renderForm() {
        return (
            <div className="form">
                <div className="menu">
                    <div className="active" onClick={(e) => this.onClickMenu(e, 1)}>
                        <p>Set bonus</p>
                    </div>
                    <div onClick={(e) => this.onClickMenu(e, 2)}>
                        <p>History</p>
                    </div>
                </div>
                {(this.state.showBonus && this.state.coinPrice && this.state.empowPrice) && this.renderSetBonus()}
                {this.state.showHistory && this.renderHistory()}
                {this.state.showHistory && this.renderHistoryScreen768()}
            </div>
        )
    }

    renderListDapp() {
        return (
            <div>
                {this.state.loading && <div className='btn-loading'>
                    <img src={LoadingIcon} alt="photos" />
                </div>}
                {this.state.listDapp && <ul>
                    {this.state.listDapp.length > 0 && <p style={{ paddingTop: '10px', paddingBottom: '10px' }}>Search Result</p>}
                    {this.state.listDapp.length === 0 && <p style={{ paddingTop: '10px', paddingBottom: '10px' }}>No Result Found</p>}
                    {this.state.listDapp.map((value, index) => {
                        return (<li key={index} className="dapp" onClick={() => this.selectSearchResult(value)}>
                            <div className="group-left">
                                <img src={`${API_ENDPOINT}/image/${value.logo_url}`} alt="photos"></img>
                                <p>{value.fullname}</p>
                            </div>

                            <div className="group-right">
                                <p>{value.amount_reward} {value.bonus_amount !== 0 && <span>+ {value.bonus_amount}</span>} EM/transaction</p>
                                <p>{value.remain_amount}</p>
                            </div>
                        </li>)
                    })}
                </ul>}
            </div>
        )
    }

    render() {
        return (
            <div className="bg-general" id="bonus">
                <Headers />
                <div className="container">
                    <div className="waper-header">
                        <div className="waper-search">
                            <input placeholder="Search for Token Name" onKeyDown={this.handleKeyDown}></input>
                            {this.state.currentDapp && <React.Fragment>
                                <p style={{ paddingTop: '10px', paddingBottom: '10px' }}>Current Dapp</p>
                                <div className="dapp" style={{ cursor: 'default' }}>
                                    <div className="group-left">
                                        <img src={`${API_ENDPOINT}/image/${this.state.currentDapp.logo_url}`} alt="photos"></img>
                                        <p>{this.state.currentDapp.fullname}</p>
                                    </div>
                                    <div className="group-right">
                                        <p>{this.state.currentDapp.amount_reward} {this.state.currentDapp.bonus_amount !== 0 && <span>+ {this.state.currentDapp.bonus_amount}</span>} EM/transaction</p>
                                        <p>{this.state.currentDapp.remain_amount}</p>
                                    </div>
                                </div>
                            </React.Fragment>}
                            {this.renderListDapp()}
                        </div>
                        <div className="child">
                            <p>Total EM has been set</p>
                            <p>{this.state.currentDapp && this.state.currentDapp.total_amount ? this.state.currentDapp.total_amount.toFixed(2) : 0}</p>
                        </div>
                        <div className="child">
                            <p>Total EM remain</p>
                            <p>{this.state.currentDapp && this.state.currentDapp.remain_amount ? this.state.currentDapp.remain_amount.toFixed(2) : 0}</p>
                        </div>
                    </div>

                    {this.renderForm()}

                </div>
                <Fooder />
            </div>
        )
    }
}

export default BonusController;