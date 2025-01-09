import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom';
import { useLocalStorage } from "usehooks-ts";

const { Web3 } = require('web3');
const URL = 'wss://eth-goerli.g.alchemy.com/v2/zCeQuHRZxylPkCVxv4T6n-fe3ubmcJj4'
const provider = new Web3.providers.WebsocketProvider(URL)

const web3 = new Web3(new Web3.providers.HttpProvider('https://eth-goerli.g.alchemy.com/v2/zCeQuHRZxylPkCVxv4T6n-fe3ubmcJj4'));
const web3Socket = new Web3(provider)

const globalUrl = "https://goerli.etherscan.io/tx/";


function UserActivity() {
    const [loggedUser, setLoggedUser] = useLocalStorage("loggedUser", undefined);
    const [userTransactions, setUserTransactions] = useState()
    const [transactionsNotFoundMsg, setTransactionsNotFoundMsg] = useState()
   
    useEffect(() => {
        const getUserTransaction = async() => {
            try {

                let response = await fetch(`http://127.0.0.1:5000/address-normal-transactions?userAddress=${loggedUser.userAccountAddress}`);
                let data = await response.json();
                let recupLastTenItems = []
                for(let i = 0; i < data.length; i++) {
                    if(i < 10) {
                        recupLastTenItems.push(data[i])
                    }
                    else {
                        break
                    }
                    console.log("recupLastTenItems :: ", recupLastTenItems);
                    setUserTransactions(recupLastTenItems)
                }
                
                console.log(userTransactions);
            }
            catch(e) {
                console.log(e.message);
                setTransactionsNotFoundMsg("Votre historique de transactions est vide.")
            }
        }
        getUserTransaction()
    },[]) //[loggedUser.userAccountAddress, userTransactions]

    return (
        <div>
            <p className='mt-2'>{transactionsNotFoundMsg}</p>
            { userTransactions ?
                userTransactions.map((userTx, key) => (
                    <div className='flex flex-1 justify-between' key={key}>
                        <div className="tx-lef flex flex-col mt-2">
                            <Link to={globalUrl+userTx.hash}>Tx hash</Link>
                            <span>{new Date(userTx.timeStamp* 1000).toISOString().slice(0, 19).replace('T', ' ')}</span>
                        </div>
                        <div className="tx-right mt-2">
                            <span>{Math.trunc(web3.utils.fromWei(userTx.value, 'ether') * Math.pow(10,4))/Math.pow(10,4)} goerliETH</span>
                        </div>
                    </div>
                ))
                :
                null
            }
        </div>
    )
}

export default UserActivity