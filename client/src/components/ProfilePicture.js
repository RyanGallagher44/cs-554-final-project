import React from 'react';
import '../App.css';
import guitar from './pictures/guitar.png'
import headphones from './pictures/headphones.jpg'
import musicnote from './pictures/musicnote.jpg'

function ProfilePicture() {
  return (
    <div>
        <h2>Change your profile picture</h2>
        
        <div class = "pictures">
        <h3>Choose a picture:</h3>
            <button><img class = "profPic" src = {guitar}/></button>
            <button><img class = "profPic" src = {headphones}/></button>
            <button><img class = "profPic" src = {musicnote}/></button>
        </div>
        <div class = "borders">
            <h3>Choose a border color:</h3>
            <button>Red</button>
            <button>Green</button>
            <button>Blue</button>
            <button>Purple</button>
            <button>Yellow</button>
        </div>
    </div>
  );
}

export default ProfilePicture;
