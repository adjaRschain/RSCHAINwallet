import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCopy, faAdd, faShare, faExchange } from "@fortawesome/free-solid-svg-icons";
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useLocalStorage } from "usehooks-ts";
import CreateNewTokensInWallet from "../../../components/Accounts/CreateNewTokensInWallet";
import CreateNewAddressesInWallet from "../../../components/Accounts/CreateNewAddressesInWallet";
import useWatchLoggedUserForUpdateUserList from "../../../hooks/useWatchLoggedUserForUpdateUserList";

import Dropdown from "react-dropdown";
import "react-dropdown/style.css";
import useAccountManager from "../../../hooks/useAccountManager";
import UserActivity from "../../../components/UserActivity";
import { usePasswordStore } from "../../../walletpasswordsstore/passwordStore";

const options = ["one", "two", "three"];
const defaultOption = options[0];

const { Web3 } = require("web3");

let currencySymbol;

export default function DashboardPage() {
  //On appel le watcher sur le user list de sorte à l'appeler une fois pour être pris en compte sur tous les composants enfants
  useWatchLoggedUserForUpdateUserList();

  const { accountAddresses, activeAccount, setActiveAccount } = useAccountManager();

  const [loggedUser, setLoggedUser] = useLocalStorage("loggedUser", undefined);

  const [currentAccountBalance, setCurrentAccountBalance] = useState();
  const [showTokenBalance, setShowTokenBalance] = useState(false);
  const [toggle, setToggle] = useState(true);
  const [ercTokensBalance, setErc20TokensBalance] = useState();

  const [walletBalanceMsg, setWalletBalanceMsg] = useState();

  const [toggleState, setToggleState] = useState(1);

  const networksList = {
    ethereum : {
        chainId : `0x${Number(5).toString(16)}`,
        chainName : "Goerli Test Network",
        nativeCurrency : {
            name: "ETH",
            symbol : "ETH",
            decimals : 18,
        },
        rpcUrls : ["https://goerli.infura.io/v3/de3d13287e364f62b243a7e05639d9bb"],
        blockExplorerUrls : ["https://goerli.etherscan.io/"]
    },
    polygon: {
        chainId: `0x${Number(137).toString(16)}`,
        chainName: "Polygon",
        nativeCurrency: {
        name: "MATIC",
        symbol: "MATIC",
        decimals: 18
        },
        rpcUrls: ["https://polygon-rpc.com/"],
        blockExplorerUrls: ["https://polygonscan.com/"]
    },
    bsc: {
        chainId: `0x${Number(56).toString(16)}`,
        chainName: "BNB Smart Chain",
        nativeCurrency: {
        name: "Binance Chain Native Token",
        symbol: "BNB",
        decimals: 18
        },
        rpcUrls: ["https://nodes.pancakeswap.info"],
        blockExplorerUrls: ["https://bscscan.com"]
    }
  };
  
  const [network, setNetwork] = useState(networksList)
  const [networkData, setNetworkData] = useState()


  const {passwords} = usePasswordStore(
    (state) => ({
      passwords : state.passwords
    })
  )

  const addPasswords = usePasswordStore((state) => state.addPasswords);

  const toggleTab = (index) => {
    setToggleState(index);
  };

  const toggleFunction = () => {
    setToggle(!toggle);
    setShowTokenBalance(true);
  };

  const getAnotherTokensBalance = async (e) => {
    e.preventDefault();
    if (networkData === "0x5") {
      const web3 = new Web3(
        new Web3.providers.HttpProvider(
          "https://eth-goerli.g.alchemy.com/v2/zCeQuHRZxylPkCVxv4T6n-fe3ubmcJj4"
        )
      );
      let inputToken = web3.utils.toChecksumAddress(e.target.value);
      if (
        inputToken !==
        web3.utils.toChecksumAddress("0xB4FBF271143F4FBf7B91A5ded31805e42b2208d6")
      ) {
        let response = await fetch(
          `http://127.0.0.1:5000/token-balance?tokenAddress=${inputToken}&userAddress=${activeAccount.address}`
        );
        let data = await response.text();
        console.log("data:::", data);
        setErc20TokensBalance(data);
        setWalletBalanceMsg("");
        return data;
      } else {
        setWalletBalanceMsg("Regardez le balance de votre adresse plus haut.");
      }
    }
    else if (networkData === "0x89") {
      const web3 = new Web3(new Web3.providers.HttpProvider("https://polygon-mumbai.g.alchemy.com/v2/mocmkLt9ePX4ZLtLXAKJZuFuRKk6-Sma"));
      let inputToken = web3.utils.toChecksumAddress(e.target.value);
      if (inputToken !== web3.utils.toChecksumAddress("0xB4FBF271143F4FBf7B91A5ded31805e42b2208d6")) {
        let response = await fetch(`http://127.0.0.1:5000/token-balance?tokenAddress=${inputToken}&userAddress=${activeAccount.address}`);
        let data = await response.text();
        console.log("data:::", data);
        setErc20TokensBalance(data);
        setWalletBalanceMsg("");
        return data;
      } else {
        setWalletBalanceMsg("Regardez le balance de votre adresse plus haut.");
      }
    }
  };

  const logOut = () => {
    setLoggedUser();
    addPasswords("")
  };

  useEffect(() => {
    async function getActiveAccountBalance() {
      if (networkData === "0x5") {
        currencySymbol = "goerliETH"
        console.log("goerli");
        const web3 = new Web3(
          new Web3.providers.HttpProvider(
            "https://eth-goerli.g.alchemy.com/v2/zCeQuHRZxylPkCVxv4T6n-fe3ubmcJj4"
          )
        );

        let activeAccountBalance = await web3.eth.getBalance(activeAccount.address);
        activeAccountBalance = web3.utils.fromWei(activeAccountBalance, "ether");

        activeAccountBalance = Math.trunc(activeAccountBalance * Math.pow(10,4))/Math.pow(10,4)
        setCurrentAccountBalance(activeAccountBalance)
        
        
      }
      else if (networkData === "0x89") {
            console.log("polygon");
            const web3 = new Web3(
                new Web3.providers.HttpProvider(
                    "https://polygon-mumbai.g.alchemy.com/v2/mocmkLt9ePX4ZLtLXAKJZuFuRKk6-Sma"
                )
            );
        let activeAccountBalance = await web3.eth.getBalance(activeAccount.address);
        activeAccountBalance = web3.utils.fromWei(activeAccountBalance, "ether");
        activeAccountBalance = Number(activeAccountBalance);
        setCurrentAccountBalance(activeAccountBalance.toFixed(5))
        }
    }
    getActiveAccountBalance()
  }, [activeAccount.address, networkData])

  const handleOptionChangeSwapFrom = (e) => {
        e.preventDefault(); 
        setNetworkData(e.target.value)
    } 

  async function clipboardFun() {
    navigator.clipboard.writeText(loggedUser.userAccountAddress);
  }

  let abbreviatedStartAddress = loggedUser.userAccountAddress.substr(0, 5);
  let abbreviatedEndAddress = loggedUser.userAccountAddress.substr(34);
  let abbreviatedAddressOld = abbreviatedStartAddress + "..." + abbreviatedEndAddress;

  const abbreviatedAddress = React.useMemo(() => {
    if (activeAccount)
      return `${activeAccount.address.substr(
        0,
        5
      )}...${activeAccount.address.substr(34)}`;
  }, [activeAccount]);
  
  return (
    <div className="accounts-infos p-4">
      <>
        <div className="walletHeader flex justify-between mb-4">
          <div >
            <main className="">
              <select name='swapDe' id="swapDe-select" className="w-24" onChange={handleOptionChangeSwapFrom}>{/**/}
                  <option value="" hidden>Networks...</option>
                  <option value={network.ethereum.chainId}>{network.ethereum.chainName}</option>
                  <option value={network.polygon.chainId}>{network.polygon.chainName}</option>
              </select>
            </main>
          </div>
          {/* La liste de tous les comptes ajoutés et crées */}
          <Dropdown
            options={accountAddresses.map((address) => ({
              value: address.address,
              label: address.addressName,
            }))}
            onChange={(e) => setActiveAccount(e.value)}
            value={activeAccount?.address}
            placeholder="Select an option"
          />
          {/* Accounts */}
          <CreateNewAddressesInWallet/>
          <button className="show-datas bg-cyan-500 text-white p-2 rounded" onClick={() => logOut()}>Deconnexion</button>
        </div>

        {abbreviatedAddress && (
          <div className="generate-datas">
            <div className="user-account-address mt-10 mb-4 w-5/4 flex justify-center items-center">
              <strong
                className="rounded-full cursor-pointer bg-cyan-100 text-cyan-500 p-1 flex justify-center items-center"
                onClick={clipboardFun}
              >
                {abbreviatedAddress} &nbsp;

                <FontAwesomeIcon icon={faCopy} />
              </strong>
            </div>
            <div className="user-account-balance mt-2 mb-10 w-5/4 flex justify-center items-center">
              <strong className="text-3xl font-semibold">
                {currentAccountBalance} 
              </strong>
              <span className="ml-2">{currencySymbol}</span>
              
            </div>
          </div>
        )}

        {
            !activeAccount &&  (
                <div>
                    Aucune adresse sélectionner, veuillez en ajouter une ou en selectionner une
                </div>
            )
        }

        <button
          className={
            toggle
              ? "another-tokens-balance-btn-top-display underline decoration-cyan-500 mt-5 text-xl mb-10 w-11/12 flex justify-center items-center"
              : "another-tokens-balance-btn-top-none"
          }
          onClick={toggleFunction}
        >
          Obtenir les balances de tokens
        </button>
        {showTokenBalance && (
          <div className="another-tokens-balance">
            <input
              type="text"
              name=""
              id=""
              placeholder="Entrez l'adresse du token..."
              className="border p-2 border-cyan-500 mt-1 w-11/12 flex justify-center items-center rounded text-sm shadow-sm placeholder-slate-400"
              onChange={getAnotherTokensBalance}
            />
            <span className="text-xs">{ercTokensBalance}</span>
            <span>{walletBalanceMsg}</span>
          </div>
        )}

        <div className="transactions-btns flex justify-between mt-10">
          <Link to="/buy" className=" flex flex-col">
            <FontAwesomeIcon
              icon={faAdd}
              className=" bg-cyan-500 p-2 rounded-full text-white"
            />
            <span>Achéter</span>
          </Link>
          <Link to="/sendeth" className="send flex flex-col">
            <FontAwesomeIcon
              icon={faShare}
              className=" bg-cyan-500 p-2 rounded-full text-white"
            />
            <span>Envoyer</span>
          </Link>
          <Link to="/swap" className="swap flex flex-col">
            <FontAwesomeIcon
              icon={faExchange}
              className=" bg-cyan-500 p-2 rounded-full text-white"
            />
            <span>Échanger</span>
          </Link>
        </div>
      </>

      <div className="dashboardOnglets containerr mt-16">
        <div className="bloc-tabs flex ">
          <button className={toggleState === 1 ? "tabs active-tabs" : "tabs"} onClick={() => toggleTab(1)}>Tokens</button>
          <button className={toggleState === 2 ? "tabs active-tabs" : "tabs"} onClick={() => toggleTab(2)}>Activity</button>
        </div>
        <div className="content-tabs">
          <div className={toggleState === 1 ? "content w-full  active-content overflow-scroll" : "content overflow-scroll" }>
            <CreateNewTokensInWallet />
          </div>
          <div className={toggleState === 2 ? "content  active-content overflow-scroll" : "content overflow-scroll"}>
            <UserActivity/>
          </div>
        </div>
      </div>
    </div>
  );
  
}

