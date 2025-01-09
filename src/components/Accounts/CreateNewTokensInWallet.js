import React, { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAdd, faCopy } from '@fortawesome/free-solid-svg-icons';
import { useLocalStorage } from 'usehooks-ts';

const { Web3 } = require('web3');
const web3 = new Web3(new Web3.providers.HttpProvider('https://eth-goerli.g.alchemy.com/v2/zCeQuHRZxylPkCVxv4T6n-fe3ubmcJj4'));

function CreateNewTokensInWallet() {

    let tokensList = [
        {
          name: "USDC",
          address: "0x2f3A40A3db8a7e3D09B0adfEfbCe4f6F81927557",
          decimal: 6
        },
        {
          name: "USDT",
          address: "0x509Ee0d083DdF8AC028f2a56731412edD63223B9",
          decimal: 6
        },
        {
          name: "UNI",
          address: "0x1f9840a85d5af5bf1d1762f925bdaddc4201f984",
          decimal: 18
        },
        {
          name: "DAI",
          address: "0x11fe4b6ae13d2a6055c8d9cf65c55bac32b5d844",
          decimal: 18
        },
        {
          name: "LINK",
          address: "0x63bfb2118771bd0da7a6936667a7bb705a06c1ba",
          decimal: 18
        },
        {
          name: "WETH",
          address: "0xB4FBF271143F4FBf7B91A5ded31805e42b2208d6",
          decimal: 18
        },
        {
            name: "RST",
            address: "0xdb286eBfC14db88F5F487F8142D50537f7f781Cb",
            decimal: 18
        }
    ]

    const [symbol, setSymbol] =  useState();
    const [decimal, setDecimal] =  useState(0);
    const [warning, setWarning] = useState()

    const [result, setResult] = useState(true)
    const [importBtnIsClicked, setImportBtnIsClicked] = useState(false)

    const [loggedUser, setLoggedUser] = useLocalStorage('loggedUser', undefined);

    const isClickedFunc = (e) => {
        e.preventDefault()
        setImportBtnIsClicked(!importBtnIsClicked)
    }

    //charger les infos de ce nouveau token
    const getTokenImportedDatas = async(e) => {
        let result = web3.utils.isAddress(e)
        setResult(result)
        if(result) {
            for(let i = 0; i < tokensList.length; i++) {
                if(e === tokensList[i].address) {
                    setSymbol(tokensList[i].name)
                    setDecimal(tokensList[i].decimal)
                }
            }
        }
        else {
            setWarning("Veuillez entrer une adresse de jeton correcte.!");
        }
    }

    async function clipboardFun(e) {
        for(let i = 0; i < tokensList.length; i++) {
            if(e === tokensList[i].name) {
                navigator.clipboard.writeText(tokensList[i].address);
            }
        }
    }

    const modifyTokensImportedTableLocalstorage = async (e) => {
        e.preventDefault()

        let localStorageData = localStorage.getItem("userList")
        localStorageData = await JSON.parse(localStorageData)
        
        for(let i = 0; i < localStorageData.length; i++) {
            if(localStorageData[i].id === loggedUser.id) {
                console.log("Yesssss");
                if(symbol)
                    localStorageData[i].tokensImported.push(symbol)
                    localStorage.setItem("userList", JSON.stringify(localStorageData));
                    setLoggedUser({
                        ...loggedUser,
                        //Avec ça(tokensImported: [symbol]), les infos s'ecrase dans le localstorage.
                        tokensImported: [...loggedUser.tokensImported, symbol], //Donc celle ci est la meilleure methode.
                    })
            }
            else {
                console.log("no id");
            }
        }
    }
    
    return (
        <div>
            <span className={!result ? 'flex justify-center items-center bg-red-400 p-1 rounded text-white mt-4 mb-2': 'invisible' }>{warning}</span>
            <span>{loggedUser.tokensImported.map((token, index)=>(
               <li key={index}>{token}<button onClick={()=>clipboardFun(token)} className='ml-2 rounded text-cyan-500'><FontAwesomeIcon icon={faCopy}/></button></li>
            ))}</span> 
            <button onClick={e=>isClickedFunc(e)}><FontAwesomeIcon icon={faAdd} className="mr-2"/>Importer tokens</button>
            {importBtnIsClicked ? 
                <form className='flex flex-col w-full' onSubmit={e=>modifyTokensImportedTableLocalstorage(e)}>
                    <div className="flex flex-col">
                        <label htmlFor="">Adresse du contrat de jeton</label>
                        <input type="text" className='border border-cyan-500 rounded p-1 w-full' onInput={e=>getTokenImportedDatas(e.target.value)}/>
                    </div>
                    <div className="flex flex-col">
                        <label htmlFor="">Symbôle du jeton</label>
                        <input type="text" className='border border-cyan-500 rounded p-1' value={symbol} readOnly/>
                    </div>
                    <div className="flex flex-col">
                        <label htmlFor="">Nombre de décimal du jeton</label>
                        <input type="text" className='border border-cyan-500 rounded p-1' value={decimal} readOnly/>
                    </div>
                    <button className='border bg-cyan-500 text-white p-1 rounded mt-2'>Ajouter un jeton personalisé</button>
                </form>
            : null}
        </div>
    )
}

export default CreateNewTokensInWallet;