import React, { useState } from 'react'
import { useLocalStorage } from 'usehooks-ts';
import useAccountManager from '../../hooks/useAccountManager';
const { Web3 } = require('web3');
const web3 = new Web3(new Web3.providers.HttpProvider('https://eth-goerli.g.alchemy.com/v2/zCeQuHRZxylPkCVxv4T6n-fe3ubmcJj4'));

function AddAccounts() {

    const [accountAddStates, setAccountAddStates] = useState();

    const [loggedUser, setLoggedUser] = useLocalStorage('loggedUser', undefined);
    const {accountAddresses, addAccountByName} = useAccountManager();


    const accountAddDatas = (e) => {
        setAccountAddStates(e);
    }

    const addNewAccount = async (e) => {
        e.preventDefault()
        if(accountAddStates) {
            addAccountByName(accountAddStates);
        }
    }

    return (
        <div>
            {accountAddresses.map((item, key) => {
                return ( //key
                    <li key={item.address}>{item.address} : {item.balance+" ETH"}</li>
                )
            })}
            <form className='flex flex-col rounded p-2 container mx-auto w-3/4' onSubmit={e=>addNewAccount(e)}>
                <div className="inputLabel flex flex-col">
                    <label htmlFor="">Nom du compte</label>
                    <input type="text" className='border border-cyan-500 rounded p-1' onInput={e=>accountAddDatas(e.target.value)}/>
                    <span className='text-red-600 text-xs'>Obligatoire</span>
                </div>
                <div className="btns flex justify-between">
                    <button className='border bg-cyan-500 text-white rounded mt-2 p-1'>Annuler</button>
                    <button className='border bg-cyan-500 text-white rounded mt-2 p-1'>Créer</button>
                </div>
            </form>
        </div>
    )
}

export default AddAccounts
