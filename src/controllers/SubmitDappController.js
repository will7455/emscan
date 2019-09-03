import React, {Component} from 'react'
import Headers from '../components/Header';
import Select from 'react-select'
import Fooder from '../components/Fooder';
import Button from '../components/Button';
import { connect } from 'react-redux';
import { Redirect } from "react-router-dom";
import ServerAPI from '../ServerAPI'
import FirebaseService from '../services/FirebaseService';

class SubmitDappController extends Component {

    constructor(props) {
        super(props);

        this.state = {
            loading: false,
            error: false,
            success: false,
            blockchain: [
                {label: 'TRON', value: 1},
                {label: 'EOS', value: 2},
                {label: 'ETHEREUM', value: 3}
            ],
            listAddress: [
                {
                    function: '',
                    address: '',
                    web: '',
                    blockchainType: '',
                    defaultValueBlockchain: {label: 'Select your blockchain platform', value: 0 }
                },
            ],
            dapp: {
                selectedFile: null,
                file: null,
                fullname: '',
                website: '',
                description: '',
                email: '',
                telegram: '',
                blockchainType: '',
                defaultValueBlockchain: {label: 'Select your blockchain platform', value: 0 }
            }
        }
    };

    handleChangeSelectMainBlockchain = (value) => {
        var obj = this.state.dapp;
        obj.blockchainType = value.label;
        obj.defaultValueBlockchain = value;
        this.setState({
            dapp: obj
        })
    }

    handleChangeSelectBlockchain = (value, index) => {
        var obj = this.state.listAddress;
        obj[index].defaultValueBlockchain = value;
        obj[index].blockchainType = value.label;
        this.setState({
            listAddress: obj
        })
    }

    handleChange = (event) => {
        var dapp = this.state.dapp;
        dapp.file = URL.createObjectURL(event.target.files[0]);
        dapp.selectedFile = event.target.files[0];
        
        this.setState({
            dapp
        })
        event.target.value = null
    }

    handleClickImg = () => {
        var dapp = this.state.dapp;
        dapp.file = null;
        
        this.setState({
            dapp
        })
    }

    onAddAddress = () => {
        var obj = this.state.listAddress.concat({function: '', address: '', web: '', blockchainType: '', defaultValueBlockchain: {label: 'Select your blockchain platform', value: 0 }});
        this.setState({
            listAddress: obj
        })
    }

    onRemoveAddress = (index) => {
        var obj = this.state.listAddress;
        obj.splice(index, 1);
        this.setState({
            listAddress: obj
        })
    }

    onBlur = (e) => {
        var dapp = this.state.dapp;
        let name = e.target.name;
        let value = e.target.value;

        dapp[name] = value;

        this.setState({
            dapp
        });
    }

    onBlurListAddress = (value, index, name) => {
        var listAddress = this.state.listAddress;
        listAddress[index][name] = value;
        this.setState({
            listAddress
        })
    }

    submit = async () => {
        const { selectedFile,fullname,website,description,email,telegram,blockchainType } = this.state.dapp

        if(!selectedFile || !fullname || !website || !description || !email || !telegram || !blockchainType ||
            fullname === '' || website === '' || description === '' || email === '' || telegram === '' || blockchainType === '') {
            this.setState({
                error: 'Please enter full information'
            })
            return
        }

        var verify = await FirebaseService.verify();
       
        if (!verify) {
            this.setState({
                error: 'Login require'
            })
            return
        }

        this.setState({
            error: false,
            success: false,
            loading: true,
        })

        const data = new FormData() 
        data.append('logo', this.state.dapp.selectedFile);
        data.append('dapp', JSON.stringify(this.state.dapp));
        data.append('listAddress', JSON.stringify(this.state.listAddress));

        ServerAPI.createDapp(data, verify)
        .then(res => {
            this.setState({
                error: false,
                loading: false,
                success: 'Submit dapp successfully'}) 
        })
        .catch(error => {
            this.setState({
                error: error.msg ? error.msg : error,
                loading: false,
                success: false})
        });
    }

    renderAddress(index, value) {
        return (
            <div className="waper-group" key={index}>
                <div className="group2">
                    <div className="child">
                        <p>Blockchain</p>
                        <div className="select-general">
                            <Select className="react-select-container" classNamePrefix="react-select"
                                isSearchable={false}
                                options={this.state.blockchain}
                                value={value.defaultValueBlockchain}
                                onChange={(value) => this.handleChangeSelectBlockchain(value, index)}
                            />
                        </div>
                    </div>
                    <div className="child">
                        <p>Contract address</p>
                        <input placeholder="Enter contract address" className="input" value={value.address} onChange={(e) => this.onBlurListAddress(e.target.value, index, "address")} required/>
                    </div>
                </div>
                <div className="group2">
                    <div className="child">
                        <p>Function</p>
                        <input placeholder="Enter function" className="input" value={value.function} onChange={(e) => this.onBlurListAddress(e.target.value, index, "function")} required/>
                    </div>
                    <div className="child">
                        <p>Web</p>
                        <input placeholder="Enter function website" className="input" value={value.web} onChange={(e) => this.onBlurListAddress(e.target.value, index, "web")} required/>
                    </div>
                </div>
                {index > 0 && <div className="delete">
                        <button onClick={() => this.onRemoveAddress(index)}>Delete</button>
                </div>}
            </div>
        )
    }

    renderForm() {
        return (
            <div className="form">
                <div className="group1">
                    <div className="left">
                        <div>
                            <p>Dapp logo</p>
                            <input type="file" name="file" id="file" className="inputfile" onChange={(event) => this.handleChange(event)}/>
                            {!this.state.dapp.file && <label htmlFor="file">Logo</label>}
                            {this.state.dapp.file && <img src={this.state.dapp.file} onClick={() => this.handleClickImg()} alt="photos"></img>}
                        </div>
                    </div>
                    <div className="right">
                        <div style={{marginBottom: '38px'}}>
                            <p>Dapp Name</p>
                            <input placeholder="Enter your Dapp's name" className="input" name="fullname" onBlur={this.onBlur}/>
                        </div>
                        <div className="child-right">
                            <div style={{width: '49%'}}>
                                <p>Dapp Website</p>
                                <input placeholder="Enter your Dapp's website" className="input" name="website" onBlur={this.onBlur}/>
                            </div>
                            <div style={{width: '49%'}}>
                                <p>Main blockchain</p>
                                <div className="select-general">
                                    <Select className="react-select-container" classNamePrefix="react-select"
                                        isSearchable={false}
                                        options={this.state.blockchain}
                                        value={this.state.dapp.defaultValueBlockchain}
                                        onChange={(value) => this.handleChangeSelectMainBlockchain(value)}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <textarea placeholder="Description" name="description" onBlur={this.onBlur}></textarea>

                {this.state.listAddress.map((value, index) => {
                    if (index === 0) {
                        return this.renderAddress(index, value);
                    } else {
                        return (
                            <div key={index} style={{marginTop: '28px'}}>
                                {this.renderAddress(index, value)}
                            </div>
                        )
                    }
                     
                })}

                <div className="add">
                    <button onClick={this.onAddAddress}>ADD</button>
                </div>
                <div className="group3">
                    <div className="child">
                        <p>Creator's Email Address</p>
                        <input placeholder="Enter creater's email address" className="input" name="email" onBlur={this.onBlur}/>
                    </div>
                    <div className="child">
                        <p>Creator's Telegram</p>
                        <input placeholder="Enter dapp telegram" className="input" name="telegram" onBlur={this.onBlur}/>
                    </div>
                </div>
                { this.state.error && <div className="alert">{this.state.error}</div>}
                { this.state.success && <div className="alert alert-success">{this.state.success}</div>}
                <div className="button" onClick={this.submit}>
                    <Button isLoading={this.state.loading}>Submit Your Dapp</Button>
                </div>
            </div>
        )
    }

    renderSubmitDapp() {
        return (
            <div className="bg-general" id="submit-dapp">
                <Headers/>
                <div className="container">
                    <div className="title">
                        <h1>Submit Dapp</h1>
                        <p>Please enter all the information about your dapp. <br/>
                        You could update your dapp’s info at your dapp detail page. </p>
                    </div>
                    {this.renderForm()}
                   
                </div>
                <Fooder/>
            </div>
        )
    }

    render() {
        if (!this.props.loggedIn) {
            return <Redirect to={{
                pathname : '/signin',
                state: { referrer: '/submitdapp' }
            }}/>
        } else {
            return this.renderSubmitDapp();
        }
    }
}

export default connect(state => ({
    loggedIn: state.app.loggedIn,
}), ({
}))(SubmitDappController)