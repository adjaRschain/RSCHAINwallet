import React, { useState } from 'react';
import { Link } from 'react-router-dom'
import { useLocalStorage } from 'usehooks-ts';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHome } from '@fortawesome/free-solid-svg-icons'
import { ERC20ABI } from './ERC20ABI';
import { usePasswordStore } from '../walletpasswordsstore/passwordStore';

const { Web3 } = require('web3');
const web3 = new Web3(new Web3.providers.HttpProvider('https://eth-goerli.g.alchemy.com/v2/zCeQuHRZxylPkCVxv4T6n-fe3ubmcJj4'));
const CryptoJS = require("crypto-js");
const URL = 'wss://eth-goerli.g.alchemy.com/v2/zCeQuHRZxylPkCVxv4T6n-fe3ubmcJj4'
const provider = new Web3.providers.WebsocketProvider(URL)
const web3Socket = new Web3(provider)

function SendERC20Token() {

    const [hash, setHash] = useState();
    const [gasData, setGasData] = useState({});
    const [receiver, setReceiver] = useState();
    const [sendValue, setSendValue] = useState();
    const [gasChoice, setGasChoice] = useState();
    const [tokenToSendAddress, setTokenSendAddress] = useState();
    const [echec, setEchec] = useState();

    const [isTrue, setIsTrue]  = useState(false)
    const [isTrueSucess, setIsTrueSucess]  = useState(false)
    const [isTrueFailed, setIsTrueFailed]  = useState(false)


    const [pending, setPending] = useState();
    const [success, setSuccess] = useState();
    const [failed, setFailed] = useState();

    const [loggedUser, setLoggedUser] = useLocalStorage('loggedUser', undefined);
    const [alertInsuffisance, setAlertInsuffisance] = useState()


    const {passwords, addPasswords} = usePasswordStore(
        (state) => ({
            passwords : state.passwords
        })
    )

    const globalUrl = "https://goerli.etherscan.io/tx/";

    async function getGasEstimation(e) {
        e.preventDefault();
        setTimeout(async () => {
            const response = await fetch('https://api.etherscan.io/api?module=gastracker&action=gasoracle&apikey=74EXG7PUMKUZC2KPPY2JNZ6BYA94HGHRKR');
            const jsonData = await response.json();
            setGasData(jsonData.result);
            const gaspriceValue = Number(e.target.value);
            setGasChoice(gaspriceValue)
        }, 1000);
    }

    async function setReceiveraddress(e) {
        e.preventDefault();
        setReceiver(e.target.value);
    }

    async function ERC20TokenTosendAddress(e) {
        e.preventDefault();
        setTokenSendAddress(e.target.value);
    }

    async function setValueTosend(e) {
        e.preventDefault();
        setSendValue(Number(e.target.value));
        let contract = new web3.eth.Contract(ERC20ABI, tokenToSendAddress)
        let verifyBalance = await contract.methods.balanceOf(loggedUser.userAccountAddress).call()
        let convertUserInput = web3.utils.toWei(Number(e.target.value), 'ether')
        
        if(verifyBalance < convertUserInput){
            console.log("insuffisant");
            setAlertInsuffisance("Fond(s) insuffisant pour effectuer cette opération.")
        }
    }
    
    console.log("gasChoice:::", gasChoice);

    const suscribeEvent = async () => {
        (await web3Socket.eth.subscribe("newHeads")).on('data', async (result) => {
            try{
                const blockDetails = await web3Socket.eth.getBlock(result.number)
                const transactionTable = blockDetails.transactions;
                if(transactionTable.length > 0) {
                    for(let i = 0; i < transactionTable.length; i++) {
                        const txHash = await web3Socket.eth.getTransactionReceipt(transactionTable[i])
                        const txFrom = txHash.from;
                        const txStatus = Number(txHash.status);
                        if(txFrom === web3.utils.toChecksumAddress(loggedUser.userAccountAddress) || txFrom === loggedUser.userAccountAddress.toLowerCase()) {
                            if(txStatus === 1) {
                                setIsTrueSucess(true)
                                setSuccess("Success");
                            }else {
                                setIsTrueFailed(true)
                                setFailed("faileddd");
                            }
                        }
                        else {
                            continue
                        } 
                    }
                }
            }catch(err) {
                console.log();
            }
        })
    }


    async function toSendERC20Tokens(e) {
        e.preventDefault()
        
        const descripPrivateKey = loggedUser.userPrivateKey;
        const bytes  = CryptoJS.AES.decrypt(descripPrivateKey, passwords);
        const originalPrivateKey = bytes.toString(CryptoJS.enc.Utf8);
        setIsTrue(true)
        setPending("En attente...")
        await fetch("http://127.0.0.1:5000/send-token", {
            method: "POST",
            body: JSON.stringify({
                senderAddress: loggedUser.userAccountAddress,
                senderPrivateKey : originalPrivateKey,
                receiverAddress : receiver,
                tokenAddress :tokenToSendAddress,
                value : sendValue,
                // gasPrice : gasChoice
                gasPrice : 100
            }),
            headers: {
                "Content-type": "application/json; charset=UTF-8",
                "Access-Control-Allow-Origin": "*"
            }
        
        })
        .then((response) => response.json())
        .then((json) => {console.log(json)
            let data = json.tx_hash;            ;
            setHash(data);
            suscribeEvent()
            if(suscribeEvent()) {
                setIsTrue(false)
                setPending("")
            }
        });
    }

    //Disabled
    function SubmitButton(){
        return <button className='to-send-eth bg-cyan-500 text-white py-1 px-2 rounded mt-2' onClick={toSendERC20Tokens}>Envoyer</button>
    };
    
    return (
        <div className="container p-4 flex justify-center items-center">
            
            <div className='sendeth-items flex flex-col'>
                <h2 className='mb-2 text-center'>Send ERC20, choose your gas price</h2>
                <div className="flex justify-center">
                <span className={isTrue ?'text-white bg-orange-500 mx-auto p-2 mt-2 text-center': null}>{pending}</span>
                <span className={isTrueSucess ?'text-white bg-green-600 mx-auto pt-2 pb-2 pl-4 pr-4 mt-2 text-center': null}>{success}</span>
                <span className={isTrueFailed ?'text-white bg-red-600 mx-auto p-2 mt-2 text-center': null}>{failed}</span>
            </div>
                <div className="gas-estimation-btns mt-4">
                    <button className="border rounded mx-2 p-2" onClick={getGasEstimation} value={gasData.FastGasPrice}>Fast : {gasData.FastGasPrice}</button>
                    <button className="border rounded mx-2 p-2" onClick={getGasEstimation} value={gasData.SafeGasPrice}>Medium : {gasData.SafeGasPrice}</button>
                    <button className="border rounded mx-2 p-2" onClick={getGasEstimation} value={gasData.suggestBaseFee}>Low : {gasData.suggestBaseFee}</button>
                </div>
                <p>{alertInsuffisance}</p>
                <div className="sendETH-inputs flex flex-col justify-center items-center mt-6">
                    <input type="text" placeholder="Entrez l'adresse du destinataire..." onChange={setReceiveraddress} className="input-top mt-1 block w-full px-3 py-2 bg-white border border-cyan-500 rounded-md text-sm shadow-sm placeholder-slate-400
                    focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500
                    disabled:bg-slate-50 disabled:text-slate-500 disabled:border-slate-200 disabled:shadow-none
                    "/>
                    <input type="text" placeholder="L'adresse du token à envoyer..." onChange={ERC20TokenTosendAddress} className=" mt-1 block w-full px-3 py-2 bg-white border border-cyan-500 rounded-md text-sm shadow-sm placeholder-slate-400
                    focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500
                    disabled:bg-slate-50 disabled:text-slate-500 disabled:border-slate-200 disabled:shadow-none
                   "/>
                    <input type="number" placeholder='Entrez le montant en ether' onChange={setValueTosend} className="input-bot mt-1 block w-full px-3 py-2 bg-white border border-cyan-500 rounded-md text-sm shadow-sm placeholder-slate-400
                    focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500
                    disabled:bg-slate-50 disabled:text-slate-500 disabled:border-slate-200 disabled:shadow-none"/>
                </div>
                <div className="bts-toSendeth-hashLink">
                    <SubmitButton/>
                    <Link className={'hash-link' ? 'hash-link-active break-all mt-4 block text-center text-red-600' : 'hash-link-disabled'} to={globalUrl+hash}>{hash}</Link>
                </div>
                <Link to='/dashboard' className='return-to-dashboard mt-6 underline decoration-cyan-500 decoration-double flex justify-center items-center'>My dashboard <FontAwesomeIcon className='text-cyan-500' icon={faHome}/></Link>
            </div>
        </div>
    )
}

export default SendERC20Token;