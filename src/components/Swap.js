import React from 'react'
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome } from '@fortawesome/free-solid-svg-icons';
import { useState } from 'react';
import { useLocalStorage } from 'usehooks-ts';
import { usePasswordStore } from '../walletpasswordsstore/passwordStore.js';
const { uniABI } = require('./uniswapABI');
const {ERC20ABI} = require( './ERC20ABI.js');
const globalUrl = "https://goerli.etherscan.io/tx/";
const CryptoJS = require("crypto-js");

const { Web3 } = require('web3');
const URL = 'wss://eth-goerli.g.alchemy.com/v2/zCeQuHRZxylPkCVxv4T6n-fe3ubmcJj4'
const provider = new Web3.providers.WebsocketProvider(URL)

const web3 = new Web3(new Web3.providers.HttpProvider('https://eth-goerli.g.alchemy.com/v2/zCeQuHRZxylPkCVxv4T6n-fe3ubmcJj4'));
const web3Socket = new Web3(provider)

const WETH = web3.utils.toChecksumAddress("0xB4FBF271143F4FBf7B91A5ded31805e42b2208d6")

const uniswapRouteur = "0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D"


function Swap() {
    const [loggedUser, setLoggedUser] = useLocalStorage('loggedUser', undefined);

    const [token0, setToken0] = useState()
    const [token1, setToken1] = useState()
    const [input1Data, setInput1Data] = useState()
    const [input0Data, setInput0Data] = useState()
    
    const [hash, setHash] = useState()
    
    const [token0ChoiceBalance, setToken0ChoiceBalance] = useState(0)
    const [token1ChoiceBalance, setToken1ChoiceBalance] = useState(0)

    const [priceToken0BeforeSwap, setPriceToken0BeforeSwap] = useState()
    const [priceToken1BeforeSwap, setPriceToken1BeforeSwap] = useState()
    const [priceOutDefault0, setPriceOutDefault0] = useState()
    const [priceOutDefault1, setPriceOutDefault1] = useState()

    const [showToken0Symbol, setShowToken0Symbol] = useState()
    const [showToken1Symbol, setShowToken1Symbol] = useState()

    const [isTrue, setIsTrue]  = useState(false)
    const [isTrueSucess, setIsTrueSucess]  = useState(false)
    const [isTrueFailed, setIsTrueFailed]  = useState(false)


    const [pending, setPending] = useState();
    const [success, setSuccess] = useState();
    const [failed, setFailed] = useState();

    const [impactPrice, setImpactPrice] = useState(0)

    const { passwords } = usePasswordStore(
        (state) => ({
            passwords : state.passwords
        })
    )

    const factory_ABI = [{ "inputs": [{ "internalType": "address", "name": "_feeToSetter", "type": "address" }], "payable": false, "stateMutability": "nonpayable", "type": "constructor" }, { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "address", "name": "token0", "type": "address" }, { "indexed": true, "internalType": "address", "name": "token1", "type": "address" }, { "indexed": false, "internalType": "address", "name": "pair", "type": "address" }, { "indexed": false, "internalType": "uint256", "name": "", "type": "uint256" }], "name": "PairCreated", "type": "event" }, { "constant": true, "inputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "name": "allPairs", "outputs": [{ "internalType": "address", "name": "", "type": "address" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [], "name": "allPairsLength", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [{ "internalType": "address", "name": "tokenA", "type": "address" }, { "internalType": "address", "name": "tokenB", "type": "address" }], "name": "createPair", "outputs": [{ "internalType": "address", "name": "pair", "type": "address" }], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [], "name": "feeTo", "outputs": [{ "internalType": "address", "name": "", "type": "address" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [], "name": "feeToSetter", "outputs": [{ "internalType": "address", "name": "", "type": "address" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [{ "internalType": "address", "name": "", "type": "address" }, { "internalType": "address", "name": "", "type": "address" }], "name": "getPair", "outputs": [{ "internalType": "address", "name": "", "type": "address" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [{ "internalType": "address", "name": "_feeTo", "type": "address" }], "name": "setFeeTo", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [{ "internalType": "address", "name": "_feeToSetter", "type": "address" }], "name": "setFeeToSetter", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }]
    const factory_address = "0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f"
            

    const handleOptionChangeSwapFrom = (e) => {
        e.preventDefault(); 
        console.log(e.target.value);
        setToken0(e.target.value)
    } 
    
    const handleOptionChangeSwapTo = (e) => {
        e.preventDefault(); 
        console.log(e.target.value);
        setToken1(e.target.value)
    }

    const input0DataFunc = (e)=> {
        let evalue = Number(e)
        setInput0Data(evalue);
        getTokenPriceTest(e)
    }

    const input1DataFunc = (e)=> {
        setInput1Data(e);
        getTokenPriceTest()
    }
    
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
                                setPending(false)
                                setSuccess("Success");
                            }else {
                                console.log("faileddd");
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
    
    const descripPrivateKey = loggedUser.userPrivateKey;
    const bytes  = CryptoJS.AES.decrypt(descripPrivateKey, passwords);
    const originalPrivateKey = bytes.toString(CryptoJS.enc.Utf8);

    const pairFor = async function (tokenA, tokenB) {
        let factory = new web3.eth.Contract(factory_ABI, factory_address);

        let pair = await factory.methods.getPair(tokenA, tokenB).call();
        if (pair === web3.utils.toChecksumAddress("0x0000000000000000000000000000000000000000")) {
            return false
        } else {
            return pair;
        }
    };


    const swapFunction = async (e) => {
        e.preventDefault()
        /**Dès qu'on clic sur la fonction swapFunction directement le statut de la transaction est en attente. */
        setIsTrue(true)
        setPending("En attente...")

        if(token0 === WETH && input0Data) {
            console.log("exact-eth-for-tokens");
            await fetch("http://127.0.0.1:5000/swap/uniswap/exact-eth-for-tokens", {
                method: "POST",
                body: JSON.stringify({
                    receiverAddress: loggedUser.userAccountAddress,
                    receiverPrivateKey : originalPrivateKey,
                    sellToken : token0,
                    buyToken : token1,
                    contractAddress :uniswapRouteur,
                    value : input0Data,
                    gasPrice : 100
                }),
                headers: {
                    "Content-type": "application/json; charset=UTF-8",
                    "Access-Control-Allow-Origin": "*"
                }
            
            })
            .then((response) => response.json())
            .then((json) => {
                setHash(json.swapHash)
                suscribeEvent()
                if(suscribeEvent()) {
                    setIsTrue(false)
                    setPending("")
                }
            });
        }

        else if(token0 !== WETH && input0Data && token1 === WETH) {
            console.log("exact-tokens-for-eth");
            await fetch("http://127.0.0.1:5000/swap/uniswap/exact-tokens-for-eth", {
                method: "POST",
                body: JSON.stringify({
                    receiverAddress: loggedUser.userAccountAddress,
                    receiverPrivateKey : originalPrivateKey,
                    sellToken : token0,
                    //buyToken : token1,
                    contractAddress :uniswapRouteur,
                    amountIn : input0Data,
                    gasPrice : 110
                }),
                headers: {
                    "Content-type": "application/json; charset=UTF-8",
                    "Access-Control-Allow-Origin": "*"
                }
            
            })
            .then((response) => response.json())
            .then((json) => {
                setHash(json.swapHash)
                suscribeEvent()
                if(suscribeEvent()) {
                    setIsTrue(false)
                    setPending("")
                }
                
            });
        }
        
        else if(token0 !== WETH && input0Data && token1 !== WETH) {
            console.log("Dans les 'swap-exact-tokens-for-tokens'");
            const result = await pairFor(token0, token1)
            console.log("result :::", result);
            
            if(result === false) {
                console.log("swap-exact-tokens-for-tokens-not-pair");
                console.log("Impairrrrrrrrrr !!!");
                await fetch("http://127.0.0.1:5000/swap/uniswap/swap-exact-tokens-for-tokens-not-pair", {
                    method: "POST",
                    body: JSON.stringify({
                        senderAddress: loggedUser.userAccountAddress,
                        senderPrivateKey : originalPrivateKey,
                        sellToken : token0,
                        buyToken :token1,
                        contractAddress :uniswapRouteur,
                        amountIn : input0Data,
                        gasPrice : 100
                    }),
                    headers: {
                        "Content-type": "application/json; charset=UTF-8",
                        "Access-Control-Allow-Origin": "*"
                    }
            
                })
                .then((response) => response.json())
                .then((json) => {
                    console.log(json)
                    setHash(json.swapHash)
                    suscribeEvent()
                    if(suscribeEvent()) {
                        setIsTrue(false)
                        setPending("")
                    }
                });
            }
            else {
                console.log("swap-exact-tokens-for-tokens");
                console.log("Pairrrrrrrrrr !!!");
                await fetch("http://127.0.0.1:5000/swap/uniswap/swap-exact-tokens-for-tokens", {
                    method: "POST",
                    body: JSON.stringify({
                        senderAddress: loggedUser.userAccountAddress,
                        senderPrivateKey : originalPrivateKey,
                        sellToken : token0,
                        buyToken : token1,
                        contractAddress :uniswapRouteur,
                        amountIn : input0Data,
                        gasPrice : 100
                    }),
                    headers: {
                        "Content-type": "application/json; charset=UTF-8",
                        "Access-Control-Allow-Origin": "*"
                    }
            
                })
                .then((response) => response.json())
                .then((json) => {
                    console.log(json)
                    setHash(json.swapHash)
                    suscribeEvent()
                    if(suscribeEvent()) {
                        setIsTrue(false)
                        setPending("")
                    }
                });
            }
        }
        
    }




    const getTokenPriceTest = async (input0Data) => {

        const router = web3.utils.toChecksumAddress(uniswapRouteur)
        const address0 = web3.utils.toChecksumAddress(token0)
        const address1 = web3.utils.toChecksumAddress(token1)

        /**Debut Token0 */
        let token0Contract = new web3.eth.Contract(ERC20ABI, address0);
        let balanceToken0Choise = address0 === web3.utils.toChecksumAddress('0xB4FBF271143F4FBf7B91A5ded31805e42b2208d6') ? await web3.eth.getBalance(loggedUser.userAccountAddress) : await token0Contract.methods.balanceOf(loggedUser.userAccountAddress).call();
        balanceToken0Choise = web3.utils.fromWei(balanceToken0Choise, 'ether')
        setToken0ChoiceBalance(balanceToken0Choise)

        let token0Symbol = await token0Contract.methods.symbol().call();
        setShowToken0Symbol(token0Symbol)
        
        let token0Decimal = await token0Contract.methods.decimals().call()
        token0Decimal = Number(token0Decimal)
        /**Fin Token0 */

        /**Debut Token1 */
        let token1Contract = new web3.eth.Contract(ERC20ABI, address1);
        let balanceToken1Choise = address1 !== web3.utils.toChecksumAddress(WETH) ? await token1Contract.methods.balanceOf(loggedUser.userAccountAddress).call() : await web3.eth.getBalance(loggedUser.userAccountAddress);
        balanceToken1Choise = web3.utils.fromWei(balanceToken1Choise, 'ether')
        setToken1ChoiceBalance(balanceToken1Choise)

        let token1Symbol = await token1Contract.methods.symbol().call();
        setShowToken1Symbol(token1Symbol)

        let token1Decimal = await token1Contract.methods.decimals().call()
        token1Decimal = Number(token1Decimal)
        /**Fin Token2 */

        //Vérication de decimals
        if((address0 && token0Decimal === 18) &&  (address1 && token1Decimal === 18)) {
            let amountOut = input0Data
            
            console.log("Les deux decimal = 18");
            
            const amountDefault = web3.utils.toWei(1, 'ether');
            
            let amountToken1 = amountOut;
            console.log("amountToken1 : ", amountToken1);
            let routerContract = new web3.eth.Contract(uniABI, router);
            let priceOutDefault0 = await routerContract.methods.getAmountsOut(amountDefault, [address0, address1]).call()
            console.log("priceOutDefault0::", Number(priceOutDefault0[1])/ (10 ** 18));

            let priceOutDefault1 = await routerContract.methods.getAmountsIn(amountOut, [address0, address1]).call()
            console.log("priceOutDefault1::", Number(priceOutDefault1[0])/ (10 ** 18));

            //On obtient leprix du token 1
            amountToken1 = web3.utils.toWei(amountOut, 'ether');
            let priceOut = await routerContract.methods.getAmountsOut(amountToken1, [address0, address1]).call();
            console.log("priceOut :::", priceOut);
            //On obtient leprix du token 0
            let priceIn = await routerContract.methods.getAmountsIn(amountOut, [address0, address1]).call();
            console.log("priceIn ::: ", priceIn);

            setPriceToken1BeforeSwap(parseInt(priceOut[1]) / (10 ** token0Decimal));
            setPriceToken0BeforeSwap(parseInt(priceIn[0]) / (10 ** token1Decimal));

            setPriceOutDefault0(Number(priceOutDefault0[1])/ (10 ** token0Decimal))
            setPriceOutDefault1(Number(priceOutDefault1[0])/ (10 ** token1Decimal))

        }
        else if((address0 && token0Decimal === 18) && (address1 && token1Decimal !== 18)) {
            let routerContract = new web3.eth.Contract(uniABI, router) ;
            const amount0 = input0Data;
            console.log("Je rentre");
            const amount0ToWei = web3.utils.toWei(amount0, 'ether');
            console.log();

            const amountDefault = web3.utils.toWei(1, 'ether');
           
            let priceOutDefault0 = await routerContract.methods.getAmountsOut(amountDefault, [address0, address1]).call()
            console.log("priceOutDefault0 : ", priceOutDefault0);
            let priceOutDefault1 = await routerContract.methods.getAmountsIn(1, [address0, address1]).call()
            console.log("priceOutDefault1 : ", priceOutDefault1);
            //On obtient leprix du token 2
            let priceOut = await routerContract.methods.getAmountsOut(amount0ToWei, [address0, address1]).call();
            console.log("priceOut : ", priceOut);
            //On obtient leprix du token 1
            let priceIn = await routerContract.methods.getAmountsIn(amount0, [address0, address1]).call();
            console.log("priceIn : ", priceIn);
            console.log("setPriceToken1BeforeSwap & setPriceToken0BeforeSwap : ", token1Decimal, token0Decimal, "-", token1Decimal, token0Decimal - token1Decimal);
            let jeveuxvoirca0 = parseInt(priceOut[1]) / (10 ** (token1Decimal))
            console.log("jeveuxvoirca0 : ", jeveuxvoirca0);
            let jeveuxvoirca1 = (parseInt(priceIn[0]) / (10 ** token0Decimal - token1Decimal));
            console.log("jeveuxvoirca1 : ", jeveuxvoirca1);
            setPriceToken1BeforeSwap(parseInt(priceOut[1]) / (10 ** (token1Decimal)));
            setPriceToken0BeforeSwap(parseInt(priceIn[0]) / (10 ** token0Decimal - token1Decimal));

            setPriceOutDefault0(Number(priceOutDefault0[1])/ (10 ** token1Decimal));
            setPriceOutDefault1(Number(priceOutDefault1[0])/ (10 ** token0Decimal - token1Decimal));
        }
        else if((address0 && token0Decimal !== 18) &&  (address1 && token1Decimal === 18)) {
            let amountOut = input0Data
            console.log("amountOut:::", amountOut);
            const amountDefault = web3.utils.toWei(1, 'ether');
            
            let amountToken1 = amountOut;
            let routerContract = new web3.eth.Contract(uniABI, router) ;
            let priceOutDefault0 = await routerContract.methods.getAmountsOut(amountDefault, [address0, address1]).call()
            
            let priceOutDefault1 = await routerContract.methods.getAmountsIn(input0Data, [address0, address1]).call()

            //On obtient leprix du token 1
            let priceOut = await routerContract.methods.getAmountsOut(input0Data, [address0, address1]).call();

            //On obtient leprix du token 0
            let priceIn = await routerContract.methods.getAmountsIn(amountToken1, [address0, address1]).call();

            setPriceToken1BeforeSwap(parseInt(priceOut[1]) / (10 ** token1Decimal));
            setPriceToken0BeforeSwap(parseInt(priceIn[0]) / (10 ** (token1Decimal - token0Decimal)));
            
            setPriceOutDefault0(Number(priceOutDefault0[1])/ (10 ** token1Decimal));
            setPriceOutDefault1(Number(priceOutDefault1[0])/ (10 ** (token1Decimal - token0Decimal)));            

        }
        else if((address0 && token0Decimal !== 18) && (address1 && token1Decimal !== 18)) {
            let amountOut = input0Data
            console.log("Les deux decimal != 18");
            const amountDefault = web3.utils.toWei(1, 'ether');
            console.log("amountDefault:::", amountDefault);
            
            let amountToken1 = amountOut;
            let routerContract = new web3.eth.Contract(uniABI, router) ;
            let priceOutDefault0 = await routerContract.methods.getAmountsOut(amountDefault, [address0, address1]).call()
            console.log("priceOutDefault0::", Number(priceOutDefault0[1])/ (10 ** 6));

            let priceOutDefault1 = await routerContract.methods.getAmountsIn(amountDefault, [address0, address1]).call()
            console.log("priceOutDefault1::", Number(priceOutDefault1[0])/ (10 ** 6));

            //On obtient leprix du token 1
            let priceOut = await routerContract.methods.getAmountsOut(amountToken1, [address0, address1]).call();

            //On obtient leprix du token 0
            let priceIn = await routerContract.methods.getAmountsIn(amountToken1, [address0, address1]).call();

            setPriceToken1BeforeSwap(parseInt(priceOut[1]) / (10 ** token0Decimal));
            setPriceToken0BeforeSwap(parseInt(priceIn[0]) / (10 ** token1Decimal));

            setPriceOutDefault0(Number(priceOutDefault0[1])/ (10 ** token0Decimal));
            setPriceOutDefault1(Number(priceOutDefault1[0])/ (10 ** token1Decimal));
        }
    }
    
 

    return (
        <div>
            <div className="flex justify-center">
                <span className={isTrue ?'text-white bg-orange-500 mx-auto p-2 mt-2 text-center': null}>{pending}</span>
                <span className={isTrueSucess ?'text-white bg-green-600 mx-auto pt-2 pb-2 pl-4 pr-4 mt-2 text-center': null}>{success}</span>
                <span className={isTrueFailed ?'text-white bg-red-600 mx-auto p-2 mt-2 text-center': null}>{failed}</span>
            </div>
            <div className="container">
                <div className="swap-container w-3/4 mx-auto my-4">
                    <form onSubmit={e => swapFunction(e)}>
                        <div className="swap-top flex flex-col border mb-4 p-2">
                            <label htmlFor="vers">Swap de</label>
                            <div className="swap-vers flex justify-between">
                                <select name='swapDe' id="swapDe-select" onChange={handleOptionChangeSwapFrom}>
                                    <option value="" hidden>Selection...</option>
                                    <option value="0xB4FBF271143F4FBf7B91A5ded31805e42b2208d6">WETH</option>
                                    <option value="0x2f3A40A3db8a7e3D09B0adfEfbCe4f6F81927557">USDC</option>
                                    <option value="0x509Ee0d083DdF8AC028f2a56731412edD63223B9">USDT</option>
                                    <option value="0x1f9840a85d5af5bf1d1762f925bdaddc4201f984">UNI</option>
                                    <option value="0x11fe4b6ae13d2a6055c8d9cf65c55bac32b5d844">DAI</option>
                                    <option value="0x63bfb2118771bd0da7a6936667a7bb705a06c1ba">LINK</option>
                                    <option value="0xdb286eBfC14db88F5F487F8142D50537f7f781Cb">RST</option>
                                    
                                </select>
                                <input type="text" onChange={e => input0DataFunc(e.target.value)} placeholder='Montant en ether' className='w-32 focus:outline-none'/>
                            </div>
                            {/* <span>{priceToken0BeforeSwap}</span> ...*/}
                            <span>{"Solde : " + token0ChoiceBalance}</span>
                        </div>
                        <div className="swap-bot flex flex-col border p-2">
                            <label htmlFor="vers">Vers</label>
                            <div className="swap-vers flex justify-between">
                                <select name='vers' id="vers-select" onChange={handleOptionChangeSwapTo}>
                                    <option value="" hidden>Selection...</option>
                                    <option value="0x11fe4b6ae13d2a6055c8d9cf65c55bac32b5d844">DAI</option>
                                    <option value="0x2f3A40A3db8a7e3D09B0adfEfbCe4f6F81927557">USDC</option>
                                    <option value="0x509Ee0d083DdF8AC028f2a56731412edD63223B9">USDT</option>
                                    <option value="0x1f9840a85d5af5bf1d1762f925bdaddc4201f984">UNI</option>
                                    <option value="0xB4FBF271143F4FBf7B91A5ded31805e42b2208d6">WETH</option>
                                    <option value="0x63bfb2118771bd0da7a6936667a7bb705a06c1ba">LINK</option>
                                    <option value="0xdb286eBfC14db88F5F487F8142D50537f7f781Cb">RST</option>
                                </select>
                                <input type="text" onChange={e => input1DataFunc(e.target.value)} placeholder={'Montant en ether'} value={priceToken1BeforeSwap} className='w-32 focus:outline-none' readOnly/>
                            </div>
                            {/* <span>{priceToken1BeforeSwap}</span> */}
                            <span>{"Solde : " + token1ChoiceBalance}</span>
                        </div>
                        <div className="after-swap-bts flex flex-col border mt-2 p-2 rounded">
                            {input0Data && input0Data && (<div className="transaction-details flex flex-col">
                                <span className={ priceOutDefault1 ? 'font-semibold': 'invisible'}>1 {showToken1Symbol} = {priceOutDefault1} {showToken0Symbol}</span>
                                <hr />
                                <span className='flex justify-between'>Frais de réseau <strong>~</strong></span>
                                <span className='flex justify-between'>Impact sur les prix <strong>{impactPrice}</strong></span>
                                <span className='flex justify-between'>Sortie minimale <strong>{priceToken1BeforeSwap ? (priceToken1BeforeSwap * 0.1) / 100 : 0}</strong></span>
                                <span className='flex justify-between'>Sortie attendue <strong>{priceToken1BeforeSwap ? priceToken1BeforeSwap : 0}</strong></span>
                            </div>)}
                            <button className='border bg-cyan-500 text-white p-2 rounded mt-2'>Swap</button>
                        </div>
                    </form>
                    <Link className={'hash-link' ? 'hash-link-active break-all mt-4 block text-center text-red-600' : 'hash-link-disabled'} to={globalUrl+hash}>{hash}</Link>
                </div>
            </div>
            <Link to='/dashboard' className='return-to-dashboard mt-6 underline decoration-cyan-500 decoration-double flex justify-center items-center'>My dashboard <FontAwesomeIcon className='text-cyan-500' icon={faHome}/></Link>
        </div>
    )
}

export default Swap;