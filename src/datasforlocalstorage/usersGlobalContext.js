import { createContext, useState } from "react";

export const UserDatasContext = createContext({
  userPassword : "",
  userSeedPhrase : "",
  userAccountAddress : "",
  userPrivateKey : "",
  tokensImported : "",
  accountsImported:"",
  setUserDatasContext : infos => {}
})

const UserDatasContextProvider = ({ children }) => {
  const UserDatasState = {
    userPassword: "",
    userSeedPhrase: "",
    userAccountAddress: "",
    userPrivateKey: "",
    tokensImported : "",
    accountsImported:"",
    setUserDatasContext: (infos) => {
      setUserData((prevState) => {
        let finalState = {
          ...prevState,
        };

        Object.entries(infos).forEach(([key, value]) => { 
          finalState[key] = value;
        });
        return finalState;
      });
    },
  };

  const [userDatas, setUserData] = useState(UserDatasState);
  return (
    <UserDatasContext.Provider value={userDatas}>
      {children}
    </UserDatasContext.Provider>
  );
};
export default UserDatasContextProvider;
