import React, { useState } from 'react'
import { useLocalStorage } from 'usehooks-ts'
import useAccountManager from '../../hooks/useAccountManager';
const { Web3 } = require('web3');
const web3 = new Web3(new Web3.providers.HttpProvider('https://eth-goerli.g.alchemy.com/v2/zCeQuHRZxylPkCVxv4T6n-fe3ubmcJj4'));


function ImportAccounts() {
    
    const {accountAddresses, addAccountByName} = useAccountManager();

    const [loggedUser, setLoggedUser] = useLocalStorage('loggedUser', undefined);

    const [accountImportedStates, setAccountImportedStates] = useState()

    const [message, setMessage] = useState()

    const accountImportedDatasFunc = async (e) => {
        console.log(e);
        setAccountImportedStates(e)
    }

    const addNewAccoundImported = async(e) => {
        e.preventDefault()

        let localStorageData = localStorage.getItem("userList");
        localStorageData = await JSON.parse(localStorageData);

        for(let i = 0; i < localStorageData.length; i++) {
            if(localStorageData[i].id === loggedUser.id) {
                if(accountImportedStates) {
                    for(let accountAddress = 0; accountAddress < localStorageData[i].accountAddresses.length; accountAddress++) {
                        if(localStorageData[i].accountAddresses[accountAddress].privateKey === accountImportedStates) {

                            console.log(localStorageData[i].accountAddresses[accountAddress]);
                            setMessage("Existe déjà")
                        }
                        else {
                            let accountImportedDatas = web3.eth.accounts.privateKeyToAccount(accountImportedStates);
                            let importedState_Address = accountImportedDatas.address;
                            let addressImportBalance = await web3.eth.getBalance(importedState_Address)
                            let balance = web3.utils.fromWei(addressImportBalance, 'ether');
                            localStorageData[i].accountAddresses.push({
                            addressName: `Compte importé ${accountAddresses.length+1}`,
                            address: importedState_Address,
                            balance: balance,
                            privateKey: accountImportedStates
                        })

                    localStorage.setItem('userList', JSON.stringify(localStorageData))
                    
                    setLoggedUser({
                        ...loggedUser,
                        accountAddresses: [
                            ...accountAddresses,
                            {
                                addressName: `Compte importé ${accountAddresses.length+1}`,
                                address: importedState_Address,
                                balance: balance,
                                privateKey: accountImportedStates
                            },
                        ],
                    });

                    let importedState_PrivateKey = accountImportedDatas.privateKey;
                    let importedState_Balance = await web3.eth.getBalance(importedState_Address);
                    console.log(`Your account imported balance is ${importedState_Balance} ETH.`);
                }
                
            }
                }
            }
        }
    }
    
    return (
        <div>
            <form className='flex flex-col rounded p-2 container mx-auto w-3/4' onSubmit={e=>addNewAccoundImported(e)}>
                <div className="inputLabel flex flex-col">
                    <h1>{message}</h1>
                    <label htmlFor="">Entrez la clé privée</label>
                    <input type="text" className='border border-cyan-500 rounded p-1' onInput={e=>accountImportedDatasFunc(e.target.value)}/>
                </div>
                <div className="btns flex justify-between">
                    <button className='border bg-cyan-500 text-white rounded mt-2 p-1'>Annuler</button>
                    <button className='border bg-cyan-500 text-white rounded mt-2 p-1'>Importer</button>
                </div>
            </form>
        </div>
    )
}

export default ImportAccounts