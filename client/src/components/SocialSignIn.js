import React from 'react';
import {doSocialSignIn} from '../firebase/FirebaseFunctions';
import {
  Button
} from '@mui/material';
import GoogleButton from '../images/google.png';

const SocialSignIn = () => {
  const socialSignOn = async (provider) => {
    try {
      await doSocialSignIn(provider);
    } catch (error) {
      alert(error);
    }
  };
  return (
    <div className='social-signon'>
      <Button
        sx={{
          backgroundColor: '#4c8bf5',
          color: '#e1e1e1',
          '&:hover': {
            backgroundColor: '#0f64f2'
          }
        }}
        className='google-button'
        onClick={() => socialSignOn('google')}
      >
        <img
          className='google-image'
          width='25px'
          src={GoogleButton}
        />
        Sign in with Google
      </Button>
    </div>
  );
};

export default SocialSignIn;
