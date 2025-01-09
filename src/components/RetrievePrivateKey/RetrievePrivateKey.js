import React, { useState } from 'react'
import { useLocalStorage } from "usehooks-ts";
const CryptoJS = require("crypto-js");
function RetrievePrivateKey() {

    const [loggedUser, setLoggedUser] = useLocalStorage("loggedUser", undefined);
    const [verifyPassWord, setVerifyPassWord] = useState()
    const [privateKey, setPrivateKey] = useState()
    const [message, setMessage] = useState()

    const retrievePrivateKeyFunc = () => {
        if(verifyPassWord) {
            let privateKeyDecrypt = CryptoJS.AES.decrypt(loggedUser.userPrivateKey, verifyPassWord);
            privateKeyDecrypt = privateKeyDecrypt.toString(CryptoJS.enc.Utf8)
            setPrivateKey(privateKeyDecrypt)
        }
    }
    async function clipboardFun() {
        let privateKeyDecrypt = CryptoJS.AES.decrypt(loggedUser.userPrivateKey, verifyPassWord);
        privateKeyDecrypt = privateKeyDecrypt.toString(CryptoJS.enc.Utf8)
        navigator.clipboard.writeText(privateKeyDecrypt);
        setVerifyPassWord("")
    }

    const verifyPassWordFunc = (e) => {
        if(e === "test") {
            console.log("YES");
            setVerifyPassWord(e)
        }
    }

    return (
        <div className='text-center mt-2'>
            <p className='text-red-500'>{message}</p>
            <form action="">
                <input className='p-1' type="text" placeholder='Entrez votre mot de passe' onInput={e=>verifyPassWordFunc(e.target.value)} />
                <button onClick={e=>clipboardFun(e.preventDefault())} className='border border-cyan-500 mt-2'>{privateKey}</button>
                <button className='bg-cyan-500 text-white p-1' onClick={e=>retrievePrivateKeyFunc(e.preventDefault())}>Obtenir sa clé privée</button>
            </form>
        </div>
    )
}

export default RetrievePrivateKey