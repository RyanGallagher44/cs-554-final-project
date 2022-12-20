import React, {useContext, useState, useRef} from 'react';
import {AuthContext} from '../firebase/Auth';
import {doChangePassword} from '../firebase/FirebaseFunctions';
import '../App.css';
import {
  TextField,
  Button,
  Typography
} from '@mui/material';

function ChangePassword() {
  const {currentUser} = useContext(AuthContext);
  const [pwMatch, setPwMatch] = useState('');
  const currentPasswordRef = useRef('');
  const newPasswordOneRef = useRef('');
  const newPasswordTwoRef = useRef('');

  const submitForm = async (event) => {
    event.preventDefault();

    if (newPasswordOneRef.current.value !== newPasswordTwoRef.current.value) {
      setPwMatch('New Passwords do not match, please try again');
      return false;
    }

console.log(newPasswordOneRef.current.value)
console.log(currentPasswordRef.current.value);

    try {
      await doChangePassword(
        currentUser.email,
        currentPasswordRef.current.value,
        newPasswordOneRef.current.value
      );
      alert('Password has been changed, you will now be logged out');
    } catch (error) {
      alert(error);
    }
  };
  if (currentUser.providerData[0].providerId === 'password') {
    return (
      <div>
        {pwMatch && <h4 className='error'>{pwMatch}</h4>}
        <h2>Change Password</h2>
        <form onSubmit={submitForm}>
          <div className='form-group'>
            <TextField
              sx={{
                input: {
                  backgroundColor: 'white',
                  color: 'black',
                  borderRadius: '10px'
                }
              }}
              id="filled-basic"
              label="Current password"
              variant="filled"
              type="password"
              inputRef={currentPasswordRef}
              required
            />
          </div>
          <div className='form-group'>
            <TextField
              sx={{
                input: {
                  backgroundColor: 'white',
                  color: 'black',
                  borderRadius: '10px'
                }
              }}
              id="filled-basic"
              label="New password"
              variant="filled"
              type="password"
              inputRef={newPasswordOneRef}
              required
            />
          </div>
          <div className='form-group'>
            <TextField
              sx={{
                input: {
                  backgroundColor: 'white',
                  color: 'black',
                  borderRadius: '10px'
                }
              }}
              id="filled-basic"
              label="Confirm new password"
              variant="filled"
              type="password"
              inputRef={newPasswordTwoRef}
              required
            />
          </div>

          <Button
            sx={{
              backgroundColor: '#A2E4B8',
              color: 'black',
              margin: '10px',
              '&:hover': {
                backgroundColor: 'white'
              },
            }}
            type="submit"
          >
            Change Password
          </Button>
        </form>
        <br />
      </div>
    );
  } else {
    return (
      <div>
        <Typography>
          You are signed in using a Social Media Provider, You cannot change
          your password
        </Typography>
      </div>
    );
  }
}

export default ChangePassword;
