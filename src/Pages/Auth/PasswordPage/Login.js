import React, { useState, useContext } from 'react'
import { Link } from 'react-router-dom';
import { UserDatasContext } from '../../../datasforlocalstorage/usersGlobalContext';
import { useLocalStorage } from 'usehooks-ts';
import { usePasswordStore } from '../../../walletpasswordsstore/passwordStore';
const bcrypt = require("bcryptjs")


function Login() {
    
    const addPasswords = usePasswordStore((state) => state.addPasswords);
    const [password, setPassword] = useState("")


    //loggedUser est toujours undefined ici
    const [loggedUser, setLoggedUser] = useLocalStorage('loggedUser', undefined);

    const value = useContext(UserDatasContext);
    const {userPassword, userSeedPhrase, userAccountAddress, userPrivateKey, tokensImported, accountsImported, setUserDatasContext} = value;

    const [isLogin, setIsLogin] = useState(false);
    const [success, setSuccess] = useState("");
    const [echec, setEchec] = useState("");

    const storagePassword = localStorage.getItem("userList");
    const checkPassword = JSON.parse(storagePassword) || "";

    const handleChange = async(e) => {
        e.preventDefault()
        
        if(e.target.value) {
           
            let passworddd = e.target.value
            console.log("passworddd :: ", passworddd);
            setPassword(passworddd)
            addPasswords(passworddd)
            setIsLogin(true);
            setUserDatasContext({userPassword : e.target.value});
            for(let i=0; i<checkPassword.length; i++) {
                
                let verify = await bcrypt.compare(e.target.value , checkPassword[i].userPassword)
                if(verify) {
                    setLoggedUser(checkPassword[i]);
                }
                else{
                    setSuccess("Bon arrivéeee...")
                }
            }
        }else {
            setEchec("Entrez un mot de passe supérieur ou égal à 5 caractères.")
        }
    }

    return (
        <div className='container w-12/12 mx-auto'>
            <div className="flex flex-col justify-center items-center bg-cyan-500 mx-auto w-10/12 mt-20 rounded py-10">
                <h2 className="login-title text-xl">Bienvenue, connectez-vous...</h2>
                <form className='p-5'>
                    <label htmlFor="password">Mot de passe :</label>
                    <input className='mt-1 block w-full px-3 py-2 bg-white border border-cyan-500 rounded-md text-sm shadow-sm placeholder-slate-400
                    focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500
                    disabled:bg-slate-50 disabled:text-slate-500 disabled:border-slate-200 disabled:shadow-none
                    invalid:border-pink-500 invalid:text-pink-600
                    focus:invalid:border-pink-500 focus:invalid:ring-pink-500' type="password" name="password" id="password" 
                    onChange={handleChange}/>
                    {isLogin && (
                        <Link to="/seedphrase"><button className='bg-white text-cyan-500 mt-5 p-2 rounded'>Connexion</button></Link>
                    )}
                </form>
            </div>
            <span className='text-center text-white'>{!isLogin && echec}</span>
            <span className='text-center font-bold ml-9 text-cyan-500 mt-5'>{isLogin && success}</span>
        </div>
    )
}

export default Login;