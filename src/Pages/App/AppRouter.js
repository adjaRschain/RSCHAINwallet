import React from 'react';
import { Routes , Route, Navigate } from 'react-router-dom'
import SendEth from '../../components/SendEth';
import SendERC20Token from '../../components/SendERC20Token'
import DashboardPage from './DashboardPage/DashboardPage';
import Swap from '../../components/Swap';


/*Quand l'utilisateur existe */
export default function AppRouter() {
  return (
    <Routes>
      <Route path='/dashboard' element={<DashboardPage />}/>
      <Route path='/sendeth' element={<SendEth/>}/>
      <Route path='/senderctokens' element={<SendERC20Token />}/>
      <Route path='/swap' element={<Swap/>}/>
      <Route path='/*' element={<Navigate replace to="dashboard" />} />
    </Routes>
  );
}
