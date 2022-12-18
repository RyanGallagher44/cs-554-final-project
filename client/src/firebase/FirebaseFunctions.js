import firebase from 'firebase/compat/app';
import 'firebase/auth';

function doCreateUserWithEmailAndPassword(email, password, displayName) {
    firebase.auth().createUserWithEmailAndPassword(email, password).then(function () {
        firebase.auth().currentUser.updateProfile({displayName: displayName}).then(function () {}); 
    });
}

async function doChangePassword(email, oldPassword, newPassword) {
    let credential = firebase.auth.EmailAuthProvider.credential(
        email,
        oldPassword
    );
    await firebase.auth().currentUser.reauthenticateWithCredential(credential);
    await firebase.auth().currentUser.updatePassword(newPassword);
    await doSignOut();
}

async function doSignInWithEmailAndPassword(email, password) {
    await firebase.auth().signInWithEmailAndPassword(email, password);
}

async function doPasswordReset(email) {
    await firebase.auth().sendPasswordResetEmail(email);
}

async function doPasswordUpdate(password) {
    await firebase.auth().updatePassword(password);
}

async function doSignOut() {
    await firebase.auth().signOut();
}

export {
    doCreateUserWithEmailAndPassword,
    doChangePassword,
    doSignInWithEmailAndPassword,
    doPasswordReset,
    doPasswordUpdate,
    doSignOut
};