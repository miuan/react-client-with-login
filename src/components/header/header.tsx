import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom';
import { useUserState, useUserDispatch, USER_INIT, USER_LOGOUT } from '../../contexts/userContext';
import UserHeaderComponent from './user'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import Modal from 'react-bootstrap/Modal'
import SignIn from '../../pages/login/SignIn';
import Register from '../../pages/login/Register';

export const Header = () => {
  const user = useUserState()
  const userDispatch = useUserDispatch()

  const [showSignIn, setShowSignIn] = useState<boolean>(false)
  const [showRegister, setShowRegister] = useState(true)
  
  const handleSignInClose = () => setShowSignIn(false)
  const handleSignInShow = () => setShowSignIn(true)

  const handleRegisterClose = () => setShowRegister(false)
  const handleRegisterShow = () => setShowRegister(true)

  const onLogout = () => {
    userDispatch({ type: USER_LOGOUT })
  }

  if (user.token) {
    return <UserHeaderComponent user={user} onLogout={onLogout} />
  }

  return (
    <div>

      <span onClick={handleSignInShow}>SignIn</span> | <span onClick={handleRegisterShow}>Register</span> |
      <Link to="/">Home</Link> |
      <Link to="/pricing">Pricing</Link>

      <SignIn show={showSignIn} onHide={handleSignInClose}/>
      <Register show={showRegister} onHide={handleRegisterClose}/>



      
    </div>
  )
}