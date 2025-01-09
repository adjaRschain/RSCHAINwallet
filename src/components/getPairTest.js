const { Web3 } = require('web3');
const web3 = new Web3(new Web3.providers.HttpProvider('https://eth-goerli.g.alchemy.com/v2/zCeQuHRZxylPkCVxv4T6n-fe3ubmcJj4'));


( async () => {

    const factory_ABI = [{ "inputs": [{ "internalType": "address", "name": "_feeToSetter", "type": "address" }], "payable": false, "stateMutability": "nonpayable", "type": "constructor" }, { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "address", "name": "token0", "type": "address" }, { "indexed": true, "internalType": "address", "name": "token1", "type": "address" }, { "indexed": false, "internalType": "address", "name": "pair", "type": "address" }, { "indexed": false, "internalType": "uint256", "name": "", "type": "uint256" }], "name": "PairCreated", "type": "event" }, { "constant": true, "inputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "name": "allPairs", "outputs": [{ "internalType": "address", "name": "", "type": "address" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [], "name": "allPairsLength", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [{ "internalType": "address", "name": "tokenA", "type": "address" }, { "internalType": "address", "name": "tokenB", "type": "address" }], "name": "createPair", "outputs": [{ "internalType": "address", "name": "pair", "type": "address" }], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [], "name": "feeTo", "outputs": [{ "internalType": "address", "name": "", "type": "address" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [], "name": "feeToSetter", "outputs": [{ "internalType": "address", "name": "", "type": "address" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [{ "internalType": "address", "name": "", "type": "address" }, { "internalType": "address", "name": "", "type": "address" }], "name": "getPair", "outputs": [{ "internalType": "address", "name": "", "type": "address" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [{ "internalType": "address", "name": "_feeTo", "type": "address" }], "name": "setFeeTo", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [{ "internalType": "address", "name": "_feeToSetter", "type": "address" }], "name": "setFeeToSetter", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }]
    const factory_address = "0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f"

    const pairFor = async function (tokenA, tokenB) {
        let factory = new web3.eth.Contract(factory_ABI, factory_address);

        let pair = await factory.methods.getPair(tokenA, tokenB).call();
        if (pair === web3.utils.toChecksumAddress("0x0000000000000000000000000000000000000000")) {
            return false
        } else {
            return pair;
        }
    };

    const result = await pairFor("0x2f3A40A3db8a7e3D09B0adfEfbCe4f6F81927557", "0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984")
    console.log("PairFor result ::: ", result);
    if (result === false) {
        console.log("Impairrrrrrrrrr !!!");
        await fetch("http://127.0.0.1:5000/swap/uniswap/swap-exact-tokens-for-tokens-not-pair", {
            method: "POST",
            body: JSON.stringify({
                senderAddress: "0xDda1313BbBD65327C29322e3Bc0DF19e056a2cab",
                senderPrivateKey : "0x8adafeec53a145dacd94e316b99898993ab1059bb8b37074077fe9b50f058eeb",
                sellToken : "0x2f3A40A3db8a7e3D09B0adfEfbCe4f6F81927557",
                buyToken : "0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984",
                contractAddress :"0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D",
                amountIn : 0.1,
                gasPrice : 100
            }),
            headers: {
                "Content-type": "application/json; charset=UTF-8",
                "Access-Control-Allow-Origin": "*"
            }
    
        })
    }
    else {
        console.log("Pairrrrrrrrrr !!!");
        await fetch("http://127.0.0.1:5000/swap/uniswap/swap-exact-tokens-for-tokens", {
            method: "POST",
            body: JSON.stringify({
                senderAddress: "0xDda1313BbBD65327C29322e3Bc0DF19e056a2cab",
                senderPrivateKey : "0x8adafeec53a145dacd94e316b99898993ab1059bb8b37074077fe9b50f058eeb",
                sellToken : "0x2f3A40A3db8a7e3D09B0adfEfbCe4f6F81927557",
                buyToken : "0xB4FBF271143F4FBf7B91A5ded31805e42b2208d6",
                contractAddress :"0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D",
                amountIn : 0.1,
                gasPrice : 100
            }),
            headers: {
                "Content-type": "application/json; charset=UTF-8",
                "Access-Control-Allow-Origin": "*"
            }
    
        })
    }
})()