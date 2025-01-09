import React, { useState, useContext } from "react";
import { UserDatasContext } from "../../../datasforlocalstorage/usersGlobalContext";
import { addNewUser } from "../../../datasforlocalstorage/addNewUser";
import { useLocalStorage } from "usehooks-ts";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCopy } from "@fortawesome/free-solid-svg-icons";

const CryptoJS = require("crypto-js");
const ethers = require("ethers");
const { Web3 } = require("web3");
const web3 = new Web3(new Web3.providers.HttpProvider("https://eth-goerli.g.alchemy.com/v2/zCeQuHRZxylPkCVxv4T6n-fe3ubmcJj4"));
const bcrypt = require("bcryptjs")

const degredehashage = 8;
export const passwordGlobale = [];

function SeedPhrase() {
    const value = useContext(UserDatasContext);
    const { userPassword, userSeedPhrase, userAccountAddress, userPrivateKey, tokensImported, accountsImported, setUserDatasContext } = value;

    const [seedphrase, setSeedphrase] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [loggedUser, setLoggedUser] = useLocalStorage("loggedUser", undefined);

    const wallet = ethers.Wallet.createRandom();


    async function getSeedPhrase(e) {
        e.preventDefault();
        const phrase = wallet.mnemonic.phrase;
        setSeedphrase(phrase);

        const phraseCopy = phrase.split(" ");
        setUserDatasContext({ userSeedPhrase: phrase });
    }

    //fonction de copié collé.
    async function clipboardFun() {
        navigator.clipboard.writeText(seedphrase);
    }

    async function hashFunc(password) {
        let hash = await bcrypt.hash(password, degredehashage);
        return hash;
    }

    async function loginUser() {
        setIsLoading(true);
        const wallet = ethers.Wallet.createRandom();

        const wallet_account_address = web3.utils.toChecksumAddress(wallet.address);
        let accountCreated_Balance = await web3.eth.getBalance(wallet_account_address);
        let accountCreated_Balance_Nub = Number(accountCreated_Balance);

        const privatekey = wallet.privateKey;
        
        const privateKeyEncrypt = CryptoJS.AES.encrypt(privatekey, userPassword).toString();
        
        const seedPhraseEncrypt = CryptoJS.AES.encrypt(userSeedPhrase, userPassword).toString();
        let passwordHash = await hashFunc(userPassword)

        let userData = {
            selectedAddressId: wallet.address,
            accountAddresses: [
                {
                addressName: `Account ${userAccountAddress.length+1}`, //"Account 1",
                address: wallet.address,
                balance: accountCreated_Balance_Nub,
                privatekey:  wallet.privateKey
                },
            ],
            
            userPassword: passwordHash,
            userSeedPhrase: seedPhraseEncrypt,
            userAccountAddress: wallet_account_address,
            userPrivateKey: privateKeyEncrypt,
            tokensImported : [],
            accountsImported : []
        }; 

        addNewUser(userData);
        setLoggedUser(userData);
        setIsLoading(false);
    }
    
    return (
        <div className="seedphrase p-2 flex flex-col justify-center items-center bg-cyan-500 mx-auto w-11/12 mt-20 rounded py-10">
            <h2 className="seedphrase-title mb-5 text-center text-2xl text-white">SeedPhrase</h2>
            <button className="text-start mb-5" onClick={clipboardFun}>
                Copier
                <FontAwesomeIcon icon={faCopy} />
            </button>
            
            <div className="seed-phrase">
                <span className="p-4 text-center flex justify-start text-xl text-white">{seedphrase}</span>
                <div className="seed-phrase-btn-link flex justify-between items-center mt-6">
                    <button className="seedpharse-btn border border-white bg-slate-300 mr-2 p-2 text-cyan-500" onClick={getSeedPhrase}>Phrase secrète</button>
                    {isLoading ? (
                            <div>Chargement...</div>
                        ) : (
                        <button className="next-btn-seedphrase border ml-2 p-2 bg-slate-300 mr-2 text-cyan-500" onClick={loginUser}>Suivant{">"} </button>
                    )}
                </div>
            </div>
        </div>
    );
}

export default SeedPhrase;