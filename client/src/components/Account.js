import React from 'react';
import SignOutButton from './SignOut';
import '../App.css';
import ChangePassword from './ChangePassword';
import ProfilePicture from './ProfilePicture';

function Account() {
  return (
    <div>
      <h2>Account Page</h2>
      <ChangePassword />
      <ProfilePicture />
      <SignOutButton />
    </div>
  );
}

export default Account;
