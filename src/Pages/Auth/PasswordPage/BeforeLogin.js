import React from 'react'
import {Link} from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faWallet } from '@fortawesome/free-solid-svg-icons'

function BeforeLogin() {
  return (
    <div className='flex flex-col justify-center items-center p-5'>
      <span className='mb-10'><FontAwesomeIcon icon={faWallet} className="text-6xl text-cyan-500 text-center"/></span>
      <h2 className='mb-2'>Bienvenue dans Rs-Wallet</h2>
      <span className='mb-2'>Rs-wallet est un coffre sécurisé pour votre idéntité sur les blockchains.</span>
      <span className='mb-2'>Nous sommes content de vous voir...</span>
      <Link to='/login' className='text-blue-600 visited:text-purple-600 border mt-10'><button className='bg-cyan-400 p-2 text-white rounded'>Demarrer</button></Link>
    </div>
  )
}

export default BeforeLogin