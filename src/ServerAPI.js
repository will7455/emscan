import Axios from "axios";
import { API_ENDPOINT, CONTRACT_ADDRESS } from './constants/index'

const ServerAPI = {
    createDapp(data, idToken) {
        return new Promise ( (resolve,reject) => {
            Axios.post(`${API_ENDPOINT}/dapp?idToken=${idToken}`, data)
            .then(res => (resolve(res.data)))
            .catch(error => (reject(error.response.data)))
        })
    },

    getDApp(page = 1, pageSize = 5) {
        return new Promise ( (resolve,reject) => {
            Axios.get(`${API_ENDPOINT}/dapp?page=${page}&pageSize=${pageSize}`)
            .then(res => (resolve(res.data)))
            .catch(error => (reject(error.response.data)))
        })
    },

    getDAppAddressByDappId(dappId, page = 1, pageSize = 2) {
        return new Promise ( (resolve,reject) => {
            Axios.get(`${API_ENDPOINT}/dapp/address/${dappId}?page=${page}&pageSize=${pageSize}`)
            .then(res => (resolve(res.data)))
            .catch(error => (reject(error.response.data)))
        })
    },

    getDAppByKey(key, page = 1, pageSize = 5) {
        return new Promise ( (resolve,reject) => {
            Axios.get(`${API_ENDPOINT}/dapp/${key}?page=${page}&pageSize=${pageSize}`)
            .then(res => (resolve(res.data)))
            .catch(error => (reject(error.response.data)))
        })
    },

    getDappradar(id, blockchain_type) {
        
        return new Promise ( (resolve,reject) => {
            var link = `https://dappradar.com/api/dapp/${id}`;
            if (blockchain_type !== "ethereum") {
                link = `https://dappradar.com/api/${blockchain_type}/dapp/${id}`;
            }

            Axios.get(link)
            .then(res => (resolve(res.data)))
            .catch(error => (reject(error.response.data)))
        })
    },

    getCountDApp() {
        return new Promise ( (resolve,reject) => {
            Axios.get(`${API_ENDPOINT}/dapp/count`)
            .then(res => (resolve(res.data)))
            .catch(error => (reject(error.response.data)))
        })
    },

    getCountUser() {
        return new Promise ( (resolve,reject) => {
            Axios.get(`${API_ENDPOINT}/user/count`)
            .then(res => (resolve(res.data)))
            .catch(error => (reject(error.response.data)))
        })
    },

    getSumPointNotWithdrawn() {
        return new Promise ( (resolve,reject) => {
            Axios.get(`${API_ENDPOINT}/point/sum`)
            .then(res => (resolve(res.data)))
            .catch(error => (reject(error.response.data)))
        })
    },

    getSumPointHasWithdrawn() {
        return new Promise ( (resolve,reject) => {
            Axios.get(`${API_ENDPOINT}/point/histories/sum`)
            .then(res => (resolve(res.data)))
            .catch(error => (reject(error.response.data)))
        })
    },

    getCountDAppByKey(dappName) {
        return new Promise ( (resolve,reject) => {
            Axios.get(`${API_ENDPOINT}/dapp/count/${dappName}`)
            .then(res => (resolve(res.data)))
            .catch(error => (reject(error.response.data)))
        })
    },

    getCountDAppAddressByDappId(dappId) {
        return new Promise ( (resolve,reject) => {
            Axios.get(`${API_ENDPOINT}/dapp/address/count/${dappId}`)
            .then(res => (resolve(res.data)))
            .catch(error => (reject(error.response.data)))
        })
    },

    getTopPoint() {
        return new Promise ( (resolve,reject) => {
            Axios.get(`${API_ENDPOINT}/point/top`)
            .then(res => (resolve(res.data)))
            .catch(error => (reject(error.response.data)))
        })
    },

    getUser(uuid) {
        return new Promise ( (resolve,reject) => {
            Axios.get(`${API_ENDPOINT}/user/${uuid}`)
            .then(res => (resolve(res.data)))
            .catch(error => (reject(error.response.data)))
        })
    },

    getPrice(key) {
        return new Promise ( (resolve,reject) => {
            Axios.get(`${API_ENDPOINT}/price/${key}`)
            .then(res => (resolve(res.data.value)))
            .catch(error => (reject(error.response.data)))
        })
    },

    getDappBonus(dappId, page = 1, pageSize = 5) {
        return new Promise ( (resolve,reject) => {
            Axios.get(`${API_ENDPOINT}/dapp/bonus/${dappId}?page=${page}&pageSize=${pageSize}`)
            .then(res => (resolve(res.data)))
            .catch(error => (reject(error.response.data)))
        })
    },

    getCoinPrice() {
        return new Promise ( (resolve,reject) => {
            const listCoin = "ethereum,tron,tether"
            const currencies = "usd"
            Axios.get(`https://api.coingecko.com/api/v3/simple/price?ids=${listCoin}&vs_currencies=${currencies}&include_24hr_change=true`)
            .then(res => (resolve(res.data)))
            .catch(error => (reject(error.response.data)))
        })
    },
    
    getCountDappBonus(dappId) {
        return new Promise ( (resolve,reject) => {
            Axios.get(`${API_ENDPOINT}/dapp/bonus/count/${dappId}`)
            .then(res => (resolve(res.data)))
            .catch(error => (reject(error.response.data)))
        })
    },

    getTxList(address, page, pageSize) {
        return new Promise ( (resolve,reject) => {
            Axios.get(`https://api.etherscan.io/api?module=account&action=txlist&address=${address}&startblock=0&endblock=99999999&sort=desc&page=${page}&offset=${pageSize}&apikey=YourApiKeyToken`)
            .then(res => (resolve(res.data)))
            .catch(error => (reject(error.response.data)))
        })
    },

    getAddressInfo(address) {
        return new Promise ( (resolve,reject) => {
            Axios.get(`https://api.ethplorer.io/getAddressInfo/${address}?apiKey=freekey`)
            .then(res => (resolve(res.data)))
            .catch(error => ( console.log(error.response))) //reject(error.response.data)))
        })
    },

    getETHprice() {
        return new Promise ( (resolve,reject) => {
            Axios.get(`https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd`)
            .then(res => (resolve(res.data)))
            .catch(error => (reject(error.response.data)))
        })
    },

    getTopAddress() {
        return new Promise ( (resolve,reject) => {
            Axios.get(`https://api.ethplorer.io/getTopTokenHolders/${CONTRACT_ADDRESS.EMPOW_TOKEN}?apiKey=freekey&limit=500`)
            .then(res => (resolve(res.data)))
            .catch(error => (reject(error.response.data)))
        })
    },

    getEthereumTxInfo (tx) {
        return new Promise ( (resolve,reject) => {
            Axios.get(`https://api.ethplorer.io/getTxInfo/${tx}?apiKey=freekey`)
            .then(res => (resolve(res.data)))
            .catch(error => (reject(error.response.data)))
        })
    },

    getEthereumTxGasInfo (tx) {
        return new Promise ( (resolve,reject) => {
            Axios.get(`https://api.etherscan.io/api?module=proxy&action=eth_getTransactionByHash&txhash=${tx}&apikey=YourApiKeyToken`)
            .then(res => (resolve(res.data)))
            .catch(error => (reject(error.response.data)))
        })
    },

    getSettingByKey (key) {
        return new Promise ( (resolve,reject) => {
            Axios.get(`${API_ENDPOINT}/setting/${key}`)
            .then(res => (resolve(res.data)))
            .catch(error => (reject(error.response.data)))
        })
    },

    createUser(idToken) {
        return new Promise ( (resolve,reject) => {
            Axios.post(`${API_ENDPOINT}/user?idToken=${idToken}`)
            .then(res => (resolve(res.data)))
            .catch(error => (reject(error.response.data)))
        })
    },
}

export default ServerAPI;
