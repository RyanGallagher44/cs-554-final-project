import React, {useContext, useRef, useState, useEffect} from 'react';
import {Navigate} from 'react-router-dom';
import {AuthContext} from '../firebase/Auth';
import {
  doSignInWithEmailAndPassword,
  doPasswordReset
} from '../firebase/FirebaseFunctions';
import {
  TextField,
  Button
} from '@mui/material';
import axios from 'axios';
import SocialSignIn from './SocialSignIn';

function SignIn() {
  const {currentUser} = useContext(AuthContext);
  const emailRef = useRef('');
  const pwRef = useRef('');

  const handleLogin = async (event) => {
    event.preventDefault();

    try {
      await doSignInWithEmailAndPassword(emailRef.current.value, pwRef.current.value);
    } catch (error) {
      alert(error);
    }
  };

  const passwordReset = (event) => {
    event.preventDefault();

    if (emailRef.current.value) {
      doPasswordReset(emailRef.current.value);
      alert('Password reset email was sent');
    } else {
      alert(
        'Please enter an email address below before you click the forgot password link'
      );
    }
  };
  if (currentUser) {
    const request = {uid: currentUser.uid, user: currentUser};
    axios.post('http://localhost:3030/users/login', request);
    return <Navigate to='/home' />;
  }
  return (
    <div className='login-div'>
      <h1>Login</h1>
      <form onSubmit={handleLogin}>
        <div className='form-group'>
          <TextField
            id="filled-basic"
            label="Email"
            variant="filled"
            type="email"
            inputRef={emailRef}
            required
          />
        </div>
        <div className='form-group'>
          <TextField
            id="filled-basic"
            label="Password"
            variant="filled"
            type="password"
            inputRef={pwRef}
            required
          />
        </div>
        <Button
          id='submitButton'
          type='submit'
          sx={{
            '&:hover': {
              backgroundColor: '#000000',
              color: '#ffffff'
            },
            textTransform: 'none',
            backgroundColor: '#1f1f1f',
            color: '#e1e1e1',
            margin: '10px',
            width: '100px'
          }}
        >
          Login
        </Button>

        <Button
          id='forgotPWButton'
          sx={{
            '&:hover': {
              backgroundColor: '#000000',
              color: '#ffffff'
            },
            textTransform: 'none',
            backgroundColor: '#1f1f1f',
            color: '#e1e1e1',
            margin: '10px',
            width: '100px'
          }}
          onClick={passwordReset}
        >
          Forgot Password
        </Button>
      </form>
      <br />
      <SocialSignIn />
    </div>
  );
}

export default SignIn;
