import React, {useContext, useState, useRef} from 'react';
import {Navigate} from 'react-router-dom';
import {doCreateUserWithEmailAndPassword} from '../firebase/FirebaseFunctions';
import {AuthContext} from '../firebase/Auth';
import {
  TextField,
  Button
} from '@mui/material';

function SignUp() {
  const {currentUser} = useContext(AuthContext);
  const [pwMatch, setPwMatch] = useState('');
  const fullNameRef = useRef('');
  const emailRef = useRef('');
  const pwRef = useRef('');
  const confirmPWRef = useRef('');

  const handleSignUp = async (e) => {
    e.preventDefault();
    if (pwRef.current.value !== confirmPWRef.current.value) {
      setPwMatch('Passwords do not match');
      return false;
    }

    try {
      await doCreateUserWithEmailAndPassword(
        emailRef.current.value,
        pwRef.current.value,
        fullNameRef.current.value
      );
    } catch (error) {
      alert(error);
    }
  };

  if (currentUser) {
    return <Navigate to='/home' />;
  }

  return (
    <div className='login-div'>
      <h1>Register</h1>
      {pwMatch && <h4 className='error'>{pwMatch}</h4>}
      <form onSubmit={handleSignUp}>
        <div className='form-group'>
          <TextField
            id="filled-basic"
            label="Full Name"
            variant="filled"
            inputRef={fullNameRef}
            required
          />
        </div>
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
        <div className='form-group'>
          <TextField
            id="filled-basic"
            label="Confirm Password"
            variant="filled"
            type="password"
            inputRef={confirmPWRef}
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
            marginTop: '10px',
            width: '100px'
          }}
        >
          Register
        </Button>
      </form>
      <br />
    </div>
  );
}

export default SignUp;
