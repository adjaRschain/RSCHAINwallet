import React, { useState } from 'react'
import AddAccounts from './AddAccounts';
import ImportAccounts from './ImportAccounts';
import "./Modal.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronUp, faGear } from "@fortawesome/free-solid-svg-icons";
import RetrievePrivateKey from '../RetrievePrivateKey/RetrievePrivateKey';
const { Web3 } = require('web3');
const web3 = new Web3(new Web3.providers.HttpProvider('https://eth-goerli.g.alchemy.com/v2/zCeQuHRZxylPkCVxv4T6n-fe3ubmcJj4'));


function CreateNewAddressesInWallet() {

    const [addIsClicked, setAddIsClicked] = useState(false)
    const [importIsClicked, setImportIsClicked] = useState(false)
    const [accountToggle, setAccountToggle] = useState(false);
    const [modal, setModal] = useState(false);
    
    
    const toggleModal = () => {
        setModal(!modal);
    };

    if(modal) {
        document.body.classList.add('active-modal')
    } else {
        document.body.classList.remove('active-modal')
    }

    const displayAddAccountInput = () => {
        setAddIsClicked(!addIsClicked)
    }

    const displayImportAccountInput = () => {
        setImportIsClicked(!importIsClicked)
    }

    return(
        <>
            <div className="accountListCreatedAdded flex flex-col">
                <button onClick={toggleModal} className="btn-modal text-cyan-600 p-1 border rounded"><FontAwesomeIcon  icon={accountToggle ? faChevronUp : faGear}/></button>
                
                {modal && (
                    <div className="modal">
                        <div onClick={toggleModal} className="overlay"></div>
                        <div className="modal-content">
                            <div className="newAddress flex flex-col">
                                <button className="mb-4" onClick={displayAddAccountInput}>Add account</button>
                                {addIsClicked ? <AddAccounts/> : null}
                                <button onClick={displayImportAccountInput}>Import account</button>
                                {importIsClicked ? <ImportAccounts/> : null}
                                <div className="retrievePrivateKey">
                                    <RetrievePrivateKey/>
                                </div>
                            </div>
                            <button className="close-modal" onClick={toggleModal}>CLOSE</button>
                        </div>
                    </div>
                )}
            </div>
        </>
    )
}

export default CreateNewAddressesInWallet