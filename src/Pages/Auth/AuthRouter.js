import React from 'react';
import { Routes , Route, Navigate } from 'react-router-dom'
import UserDatasContextProvider from '../../datasforlocalstorage/usersGlobalContext';
import Login from './PasswordPage/Login';
import SeedPhrase from './SeedPhrase/SeedPhrase';
import BeforeLogin from './PasswordPage/BeforeLogin';

/**Quand l'utilisateur n'existe pas */
export default function AuthRouter() {
  return (
    <UserDatasContextProvider>
      <Routes>
        <Route path='/beforelogin' element={<BeforeLogin/>}/>
        <Route path='/login' element={<Login />}/>
        <Route path='/*' element={<Navigate replace to="beforelogin"/>}/>
        <Route path='/seedphrase' element={<SeedPhrase/>}/>
      </Routes>
    </UserDatasContextProvider>
  );
}