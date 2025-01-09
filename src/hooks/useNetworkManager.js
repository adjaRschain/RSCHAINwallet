import React from "react";
import { useLocalStorage } from "usehooks-ts";

const { Web3 } = require("web3");
const web3 = new Web3(new Web3.providers.HttpProvider("https://eth-goerli.g.alchemy.com/v2/zCeQuHRZxylPkCVxv4T6n-fe3ubmcJj4"));

export default function useNetworkManager() {
    const [loggedUser, setLoggedUser] = useLocalStorage("loggedUser");
    const accountAddresses = React.useMemo(() => {
        //Peut etre undefined quand l'utilisateur vient de se deconnecter dans la propagation des events, donc il faut faire une vérification
        if (loggedUser) {
            return loggedUser.accountAddresses || [];
        }

        return [];
    }, [loggedUser]);

    const activeAccount = React.useMemo(() => {
            return accountAddresses.find(item => item.address === loggedUser.selectedAddressId)
        }, [accountAddresses, loggedUser.selectedAddressId]
    );

    const addAccountByName = async (addressName) => {
        let accountCreatedDatas = web3.eth.accounts.create();
        let accountCreatedAddress = accountCreatedDatas;
        let accountCreated_Address = accountCreatedDatas.address;
        let accountCreated_PrivateKey = accountCreatedDatas.privateKey;
        let accountCreated_Balance = await web3.eth.getBalance(accountCreated_Address);
        let accountCreated_Balance_Nub = Number(accountCreated_Balance);
        setLoggedUser({
        ...loggedUser,
        accountAddresses: [
            ...accountAddresses,
            {
            addressName,
            address: accountCreated_Address,
            balance: accountCreated_Balance_Nub,
            },
        ],
        });
    };

    const deleteAddress = (addressToDelete) => {
        const newAddresses = loggedUser.addresses.filter(
        (accountItem) => accountItem.address !== addressToDelete.address
        );

        setLoggedUser({
        ...loggedUser,
        accountAddresses: newAddresses,
        });
    };

    const setActiveAccount = (addressId) => {
        setLoggedUser({
            ...loggedUser,
            selectedAddressId: addressId
        });
    }

    const importAccount = () => {};

    return {
        addAccountByName,
        deleteAddress,
        importAccount,
        setActiveAccount,
        activeAccount,
        accountAddresses,
    };
}