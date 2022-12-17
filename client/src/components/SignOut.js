import React, { useEffect } from 'react';
import {doSignOut} from '../firebase/FirebaseFunctions';
import axios from 'axios';

const SignOutButton = () => {
  return (
    <button type='button' onClick={doSignOut}>
      Sign Out
    </button>
  );
};

export default SignOutButton;
