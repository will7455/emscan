import React, {Component} from 'react'
import Headers from '../components/Header';
import IconSearch from '../assets/images/icon-search.svg'
import Ads from '../assets/images/ads.svg'
import LogoTron from '../assets/images/logo-tron.svg'
import LogoEthereum from '../assets/images/logo-ethereum.svg'
import LogoEos from '../assets/images/logo-eos.svg'
import LogoIost from '../assets/images/logo-iost.svg'
import Fooder from '../components/Fooder';
import Button from '../components/Button';
import Select from 'react-select'
import ServerAPI from '../ServerAPI';
import Selected from '../assets/images/selected.svg'
import NotSelected from '../assets/images/not-selected.svg'
import Deleted from '../assets/images/deleted.svg'
import ArrowLeft from '../assets/images/arrow-left.svg'
import ArrowRight from '../assets/images/arrow-right.svg'
import LoadingIcon from '../assets/images/loading.svg'
import { Link } from 'react-router-dom';
import $ from "jquery"
import { API_ENDPOINT } from '../constants/index'
import Countdown from 'react-countdown-now';
import Utils from '../utils/index'
import FirebaseService from '../services/FirebaseService'
import { connect } from 'react-redux';

class HomeController extends Component {

    constructor(props) {
        super(props);

        this.state = {
            pageLitte: 1,
            pageSizeLitte: 5,
            totalPageLitte: 1,
            pageSize: 20,
            page: 1,
            totalPage: 1,
            showDetail: false,
            indexDetail: -1,
            data: [
                {label: 'ETHEREUM', value: 1 }
            ],
            defaultValue: {label: 'ETHEREUM', value: 1 },
            address: [
                {label: 'ALL', value: 0 },
                {label: <div><img src={LogoEos} style={{verticalAlign: '-2px'}} alt="photos"/>  EOS</div>, value: 1 },
                {label: <div><img src={LogoEthereum} style={{verticalAlign: '-2px'}} alt="photos"/>  ETHEREUM</div>, value: 2 },
                {label: <div><img src={LogoTron} style={{verticalAlign: '-2px'}} alt="photos"/>  TRON</div>, value: 3 },
                {label: <div><img src={LogoIost} style={{verticalAlign: '-2px'}} alt="photos"/>  IOST</div>, value: 4 },
            ],
            defaultValueAddress: {label: 'ALL', value: 0 },
            listCoin: false,
            loading: false,
            key: null,
            loadingList: false,
            addressFilter: '',
            isRedirect: false,
            totalDapp: 0,
            totalUser: 0,
            totalPointNotWithdrawn: 0,
            totalPointHasWithdrawn: 0,
            bonusLimit: 0,
            bonusSent: 0,
            bonusSent2: 0,
            showMyDapp: false
        };
    };
    
    componentDidUpdate() {
        if (this.state.page === 1) {
            $('.pre').attr('disabled','disabled');
        } else {
            $('.pre').removeAttr('disabled');
        }

        if (this.state.page === this.state.totalPage) {
            $('.next').attr('disabled','disabled');
        } else {
            $('.next').removeAttr('disabled');
        }
    }

    componentDidMount() {
        
        this.loadDapp(this.state.page, this.state.showMyDapp, this.state.key);
        this.loadInfo();
    } 

    loadInfo() {
        ServerAPI.getCountDApp().then(res => {
            this.setState({
                totalDapp: res
            })
        });
        ServerAPI.getCountUser().then(res => {
            this.setState({
                totalUser: res
            })
        });
        ServerAPI.getSumPointNotWithdrawn().then(res => {
            this.setState({
                totalPointNotWithdrawn: res
            })
        });
        ServerAPI.getSumPointHasWithdrawn().then(res => {
            this.setState({
                totalPointHasWithdrawn: res
            })
        });

        ServerAPI.getSettingByKey("bonus_limit").then(bonusLimit => {
            this.setState({
                bonusLimit
            })
        })

        ServerAPI.getSettingByKey("bonus_sent").then(bonusSent => {
            this.setState({
                bonusSent
            })
        })

        ServerAPI.getSettingByKey("bonus_sent_2").then(bonusSent2 => {
            this.setState({
                bonusSent2
            })
        })

        ServerAPI.getSettingByKey("user_added").then(userAdded => {
            this.setState({
                userAdded
            })
        })
    }

    loadMyDapp = async (page, key = false) => {
        this.setState({
            loadingList: true,
            listCoin: false
        })

        var listCoin = [];
        var count = 1;

        var verify = await FirebaseService.verify();

        count = await ServerAPI.getCountMyDApp(verify);
        listCoin = await ServerAPI.getMyDApp(page, this.state.pageSize, verify);

        this.setState({
            page,
            totalPage: Math.ceil(count/this.state.pageSize),
            loadingList: false,
            showDetail: false,
            indexDetail: -1,
            listCoin
        })
    }

    loadDapp = async (page, showMyDapp , key = false) => {
        if (key) {
            showMyDapp = false;
            this.setState({
                showMyDapp
            })
        }


        if (showMyDapp && this.props.loggedIn && FirebaseService.user) {
            this.loadMyDapp(page, key);
            return;
        }

        this.setState({
            loadingList: true,
            listCoin: false
        })

        var listCoin = [];
        var count = 1;

        if (key && key.trim() !== '') {
            count = await ServerAPI.getCountDAppByKey(key);
            listCoin = await ServerAPI.getDAppByKey(key, page, this.state.pageSize);
        } else {
            count = await ServerAPI.getCountDApp(showMyDapp);
            listCoin = await ServerAPI.getDApp(page, this.state.pageSize);
        }

        this.setState({
            page,
            totalPage: Math.ceil(count/this.state.pageSize),
            loadingList: false,
            showDetail: false,
            indexDetail: -1,
            listCoin
        })
    }

    setupDetail = async (index, dappId) => {
        var count = await ServerAPI.getCountDAppAddressByDappId(dappId);
        this.setState({
            totalPageLitte: Math.ceil(count/this.state.pageSizeLitte)
        })
        this.loadDappAddress(index, dappId, 1);
    }

    loadDappAddress = async (index, dappId, pageLitte) => {
        var obj = this.state.listCoin;
        var listDAppAddress = await ServerAPI.getDAppAddressByDappId(dappId, pageLitte, this.state.pageSizeLitte);
        obj[index].dappAddress = listDAppAddress;
        this.setState({
            listCoin: obj,
            loading: false,
            pageLitte
        })
    }

    upPage = () => {
        var page = this.state.page + 1 > this.state.totalPage ? this.state.page : this.state.page + 1;
        this.loadDapp(page, this.state.showMyDapp, this.state.key);
    }

    downPage = () => {
        var page = this.state.page - 1 < 1 ? 1 : this.state.page - 1;
        this.loadDapp(page, this.state.showMyDapp, this.state.key);
    }

    onClickPage = (index) => {
        this.loadDapp(index, this.state.showMyDapp, this.state.key);
    }

    onClickPageLitte = (index, indexParent, dappId) => {
        this.setState({
            loading: true
        })
        
        var pageLitte = 1;

        if (index === 1) {
            pageLitte = this.state.pageLitte === 1 ? 1 : this.state.pageLitte - 1
        }

        if (index === 2) {
            pageLitte = this.state.pageLitte === this.state.totalPageLitte ? this.state.pageLitte : this.state.pageLitte + 1
        }

        this.loadDappAddress(indexParent, dappId, pageLitte);
    }

    handleChangeSelect = (value) => {
        this.setState({
            defaultValue: value
        })
    }

    handleChangeSelectAddress = (value) => {
        this.setState({
            defaultValueAddress: value
        })
    }

    toggeDetail = (index, dappId) => {
        if (index === this.state.indexDetail) {
            this.setState({
                showDetail: !this.state.showDetail,
            })
        }

        if (index !== this.state.indexDetail) {
            this.setState({
                indexDetail: index,
                showDetail: true
            })

            if (!this.state.listCoin[index].dappAddress) {
                this.setState({
                    loading: true
                })
                this.setupDetail(index, dappId);
            }
        }
    }

    handleKeyDown = async (e) => {

        if (e.key === 'Enter') {
            this.setState({
                key: e.target.value,
                loadingList: true,
                indexDetail: 0
            })
            this.loadDapp(1, this.state.showMyDapp, e.target.value);
        }
    }

    handleKeyDownFilter = (e) => {

        const { addressFilter } = this.state

        if (e.key === 'Enter') {
            // check address or tx
            if(addressFilter.length === 42) {
                window.location = '/ethereum/address/' + addressFilter
            } else {
                window.location = '/ethereum/tx/' + addressFilter
            }
        }
    }

    onSearch = () => {
        const { addressFilter } = this.state
        // // check address or tx
        if(addressFilter.length === 42) {
            window.location = '/ethereum/address/' + addressFilter
        } else {
            window.location = '/ethereum/tx/' + addressFilter
        }
    }

    filterMyDapp = () => {
        if (!this.props.loggedIn) {
            return;
        }
        
        this.loadDapp(1, !this.state.showMyDapp, null);

        this.setState({
            showMyDapp: !this.state.showMyDapp,
            key: null
        })
    }

    renderAds() {
        return (
            <div className="ads">
                <img src={Ads} alt="photos"></img>
            </div>
        )
    }

    renderFilter() {
        return (
            <div className="filter">
                <p>EMPOW Blockchain Explorer</p>
                <div className="waper">
                    <div className="select">
                        <Select className="react-select-container" classNamePrefix="react-select"
                            isSearchable={false}
                            options={this.state.data}
                            value={this.state.defaultValue}
                            onChange={(value) => this.handleChangeSelect(value)}
                        />
                    </div>
                    <input placeholder="Search by Address / Block / Token"
                            onChange={(e) => this.setState({ addressFilter: e.target.value })}
                            onKeyDown={this.handleKeyDownFilter}></input>
                    <button className="group-search" onClick={this.onSearch}><img src={IconSearch} alt="photos"></img></button>
                </div>
            </div>
        )              
    }

    renderCountDown = (hours, minutes, seconds) => {
        return (
            <p>{hours}:{minutes}:{seconds}</p>
        )
    }

    renderCountDown = ({ hours, minutes, seconds, completed }) => {
        return (
            <p>{hours}:{minutes}:{seconds}</p>
        )
      };

    renderInfo() {
        let d = new Date();
        let fullYear = d.getUTCFullYear();
        let month = d.getUTCMonth();
        let day = d.getUTCDate();

        return (
            <div className="group-info">
                <div className="info">
                    <p>{this.state.totalUser + this.state.userAdded}</p>
                    <p>Users</p>
                </div> 
                <div className="info">
                    <p>{this.state.totalDapp}</p>
                    <p>Dapps</p>
                </div>
                <div className="info">
                    <Countdown date={new Date(Date.UTC(fullYear, month, day, 24, 59, 59))} renderer={this.renderCountDown}/> 
                    <p>Countdown</p>
                </div>
                <div className="info">
                    <p>{ Utils.formatCurrency((this.state.bonusLimit - this.state.bonusSent - this.state.bonusSent2) || 0) } EM</p>
                    <p>Token remaining</p>
                </div>
                <div className="info">
                    <p>{ Utils.formatCurrency(this.state.totalPointNotWithdrawn || 0) } EM</p>
                    <p>Not withdrawn</p>
                </div>
                <div className="info">
                    <p>{ Utils.formatCurrency(this.state.totalPointHasWithdrawn || 0) } EM</p>
                    <p>Has withdrawn</p>
                </div>
                
            </div>
        )
    }

    renderDetailCoin(dappAddress, currentDapp, indexParent, dappId) {
        return (
                <div className="detail">
                    <div className="waper-header">
                        <a href={currentDapp.website} target="_blank" rel="noopener noreferrer">{currentDapp.website}</a>
                        <div className="group-right">
                            {(this.props.loggedIn && FirebaseService.user.uid === currentDapp.user_uuid) && <Link className="button" to={{
                                pathname: "/editdapp",
                                state: { 
                                    dapp: currentDapp
                                }
                            }}>
                                <Button>Edit</Button>
                            </Link>}

                            <Link className="button" to={{
                                pathname: "/bonus",
                                state: { 
                                    currentDapp
                                }
                            }}>
                                <Button>Set bonus</Button>
                            </Link>
                        </div>
                    </div>
                    {this.state.loading && <ul className="group">   
                        <img style={{width: '50px'}} src={LoadingIcon} alt="photos"/>
                    </ul>}

                    {!this.state.loading && <ul className="group">
                        {dappAddress && dappAddress.map((value, index) => {
                            return <li key={index}>
                                    <div className="logo">
                                        {value.blockchain_type === "tron" && <img src={LogoTron} alt="photos"></img>}
                                        {value.blockchain_type === "eos" && <img src={LogoEos} alt="photos"></img>}
                                        {value.blockchain_type === "ethereum" && <img src={LogoEthereum} alt="photos"></img>}
                                        {value.blockchain_type === "iost" && <img src={LogoIost} alt="photos"></img>}
                                    </div>
                                    <div>
                                        <a rel="noopener noreferrer" target='_blank'  href={value.web} className="name">{value.function}</a>
                                    </div>

                                    <div>
                                        <p className="key">{value.address}</p>
                                    </div>
                                    <div className="status">
                                        {value.status === "accept" && <img src={Selected} alt="photos"></img>}
                                        {value.status === "pending" &&  <img src={NotSelected} alt="photos"></img>}
                                        {value.status === "decline" &&  <img src={Deleted} alt="photos"></img>}
                                    </div>
                                    </li>
                        })}
                    
                        <div className="waper-page">
                            {(this.state.pageLitte > 1) &&<button onClick={() => this.onClickPageLitte(1, indexParent, dappId)}>
                                <img src={ArrowLeft} alt="photos"></img>
                            </button>}
                            {(this.state.pageLitte !== this.state.totalPageLitte) && <button onClick={() => this.onClickPageLitte(2, indexParent, dappId)}>
                                <img src={ArrowRight} alt="photos"></img>
                            </button>}
                        </div>
                    </ul>}
                </div>)
    }

    renderBlockchainType(blockchainType) {
        if (blockchainType === "tron") {
            return  (<div className="protocol">   
                        <div className={`protocol logo-circle logo-tron`}>
                            <img src={LogoTron} alt="photos"></img>
                        </div>
                    </div>)
        }

        if (blockchainType === "eos") {
            return  (<div className="protocol">   
                        <div className={`protocol logo-circle logo-eos`}>
                            <img src={LogoEos} alt="photos"></img>
                        </div>
                    </div>)
        }

        if (blockchainType === "ethereum") {
            return  (<div className="protocol">   
                        <div className={`protocol logo-circle logo-ethereum`}>
                            <img src={LogoEthereum} alt="photos"></img>
                        </div>
                    </div>)
        }

        if (blockchainType === "iost") {
            return  (<div className="protocol">   
                        <div className={`protocol logo-circle logo-iost`}>
                            <img src={LogoIost} alt="photos"></img>
                        </div>
                    </div>)
        }
    }

    renderListCoinInfoScreen768() {
        var stt  = this.state.pageSize * (this.state.page - 1);
        return (
            <ul className="list-coin screen-768">
                    {this.state.listCoin.map((value, index) => {
                        stt++;
                        return (
                            <li key={index} className="coin">
                                <div className="info" onClick={() => this.toggeDetail(index, value.id)}>
                                    <div className="child-1">
                                        <p className="stt">#{stt}</p>
                                        <div className="name">
                                            <img src={`${API_ENDPOINT}/image/${value.logo_url}`} alt="photos"></img>
                                            <p>{value.fullname}</p>
                                        </div>
                                    </div>
                                   
                                    <div className="child-2">
                                        <p>Protocol</p>
                                        {this.renderBlockchainType(value.blockchain_type)}
                                    </div>

                                    <div className="child-2">
                                        <p>Users 24h</p>
                                        <div className="child-child">
                                            <p>{value.dau_last_day}</p>
                                            <p style={{color: `${value.dau_24h_change < 0 ? '#f94f4f' : '#48f914'}`}}>{value.dau_24h_change}%</p>
                                        </div>
                                    </div>

                                    <div className="child-2">
                                        <p>Volume 24h</p>
                                        <div className="child-child">
                                            <p>{value.volume_last_day}</p>
                                            <p style={{color: `${value.volume_24h_change < 0 ? '#f94f4f' : '#48f914'}`}}>{value.volume_24h_change}%</p>
                                        </div>
                                    </div>

                                    <div className="child-2">
                                        <p>Txs 24h</p>
                                        <p>{value.tx_last_day}</p>
                                    </div>

                                    <div className="child-2">
                                        <p>Mining EM</p>
                                        <p>{value.amount_reward} {(value.bonus_amount > 0 ? <span>+ {value.bonus_amount}</span> : '')} EM/transaction</p>
                                    </div>

                                    <div className="child-2">
                                        <p>Bonus remaining</p>
                                        <p>{value.remain_amount ? value.remain_amount.toFixed(2) : '∞'}</p>
                                    </div>
                                </div>
                                {this.state.showDetail && this.state.indexDetail === index && this.renderDetailCoin(value.dappAddress, value, index, value.id)}
                            </li>
                        )
                    })}
                </ul>
        )
    }

    renderListCoinInfo() {
        var stt  = this.state.pageSize * (this.state.page - 1);
        return (
            <ul className="list-coin screen-normal">
                    <li className="coin">
                        <div className="info title">
                            <p className="stt">#</p>
                            <p className="name">Name</p>
                            <p className="protocol">Protocol</p>
                            <p className="user-24h">User 24h</p>
                            <p className="volume-24h">Volume 24h</p>
                            <p className="txs-24h">Txs 24h</p>
                            <p className="mining-em">Mining EM</p>
                            <p className="remaining-token">Bonus remaining</p>
                        </div>
                    </li>
                    {this.state.listCoin.map((value, index) => {
                        stt++;
                        return (
                            <li key={index} className="coin">
                            <div className="info" onClick={() => this.toggeDetail(index, value.id)}>
                                <p className="stt">{stt}</p>
                                <div className="name">
                                    <img src={`${API_ENDPOINT}/image/${value.logo_url}`} alt="photos"></img>
                                    <p>{value.fullname}</p>
                                </div>
                                
                                {this.renderBlockchainType(value.blockchain_type)}
                                <div className="user-24h">
                                    <p>{value.dau_last_day }</p>
                                    <p style={{color: `${value.dau_24h_change < 0 ? '#f94f4f' : '#48f914'}`}}>{value.dau_24h_change}%</p>
                                </div>
                                <div className="volume-24h">
                                    <p>{value.volume_last_day}</p>
                                    <p style={{color: `${value.volume_24h_change < 0 ? '#f94f4f' : '#48f914'}`}}>{value.volume_24h_change}%</p>
                                </div>
                                <p className="txs-24h">{value.tx_last_day}</p>
                                <p className="mining-em">{value.amount_reward} {(value.bonus_amount > 0 ? <span>+ {value.bonus_amount}</span> : '')} EM/transaction</p>
                                <button className="remaining-token">{value.remain_amount ? value.remain_amount.toFixed(2) : '∞'}</button>
                            </div>
                            {this.state.showDetail && this.state.indexDetail === index && this.renderDetailCoin(value.dappAddress, value, index, value.id)}
                        </li>
                        )
                    })}
                </ul>
        )
    }

    renderListCoin() {
        return (
            <div>
            {!this.state.listCoin && <div style={{textAlign: 'center'}}>
                <img  src={LoadingIcon} alt="photos"></img>
            </div>}
            {this.state.listCoin && <div className="waper-content">
                <div className="group1">
                    <div className="search">
                        {!this.state.loadingList && <img  src={IconSearch} alt="photos"></img>}
                        {this.state.loadingList && <img style={{width: '30px'}} src={LoadingIcon} alt="photos"></img>}
                        <input defaultValue={this.state.key} placeholder="Search" onKeyDown={this.handleKeyDown}></input>
                    </div>
                    {this.props.loggedIn && <div className="button">
                        <Button onClick={this.filterMyDapp}>Show {!this.state.showMyDapp ? 'my' : 'all'} dapp</Button>
                    </div>}
                </div>
                {this.renderListCoinInfo()}
                {this.renderListCoinInfoScreen768()}
                <div className="group-page">
                    <button onClick={() => this.downPage()} className="pre">Previous</button>
                    <div className="waper-page">
                        {this.state.page > 1 && <button onClick={() => this.onClickPage(this.state.page - 1)}>{this.state.page - 1}</button>}
                        <button className="active" onClick={() => this.onClickPage(this.state.page)}>{this.state.page}</button>
                        {this.state.totalPage >= this.state.page + 1 && <button className={this.state.page === this.state.page + 1 ? 'active' : ''} onClick={() => this.onClickPage(this.state.page + 1)}>{this.state.page + 1}</button>}
                        {this.state.totalPage > this.state.page + 2 && <p>...</p>}
                        {this.state.totalPage >= this.state.page + 2 && <button className={this.state.page === this.state.totalPage ? 'active' : ''} onClick={() => this.onClickPage(this.state.totalPage)}>{this.state.totalPage}</button>}
                    </div>
                    <button onClick={() => this.upPage()} className="next">Next</button>
                </div>
            </div>}
            </div>
        )
    }

    renderHome() {
        return (
            <div className="bg-general" id="home">
                <Headers/>
                <div className="container wrapper">
                    {this.renderAds()}
                    {this.renderFilter()}
                    {this.renderInfo()}
                    {this.renderListCoin()}
                </div>
                <Fooder/>
            </div>
        )
    }

    render() {
        return this.renderHome();
    }
}

export default connect(state => ({
    loggedIn: state.app.loggedIn,
}), ({
}))(HomeController)