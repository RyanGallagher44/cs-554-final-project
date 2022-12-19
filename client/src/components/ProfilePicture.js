import React, {useState} from 'react';
import '../App.css';
import guitar from './pictures/guitar.jpg'
import headphones from './pictures/headphones.jpg'
import musicnote from './pictures/musicnote.jpg'
import axios from 'axios'
import { ColorPicker, ColorBox } from "material-ui-color";

function ProfilePicture() {
  const [picture, setPicture] = useState("");
  const [borderColor, setBorder] = useState("");
  const [backgroundColor, setBackground] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();

    console.log(picture)
    console.log(borderColor)
    console.log(backgroundColor)
    
    axios.get(`http://localhost:3030/image/generate/${picture}/${backgroundColor}/${borderColor}`)
    //axios.get(`http://localhost:3030/image/border/${borderColor}`)
  }
  return (
    <div>
        <h2>Change your profile picture</h2>
        <form onSubmit = {handleSubmit}>
          <div class = "pictures">
          <h3>Choose a picture:</h3>
              <div class = "pictureSub">
                <img class = "profPic" src = {guitar}/>
                <input name="picSrc" id="guitar" class = "picInput" type = "button" value = "Guitar" onClick={event => setPicture("guitar")}></input>
              </div>
              <div class = "pictureSub">
                <img class = "profPic" src = {headphones}/>
                <input name="picSrc" id="headphones" class = "picInput" type = "button" value = "Headphones" onClick={event => setPicture("headphones")}></input>
              </div>
              <div class = "pictureSub">
                <img class = "profPic" src = {musicnote}/>
                <input name="picSrc" id="musicnotes" class = "picInput" type = "button" value = "Music Notes" onClick={event => setPicture("musicnote")}></input>
              </div>
          </div>
          <div class = "background">
              <h3>Choose a background color:</h3>
              <input name = "bgColor" id = "redBG"  class = "backgroundInput" type = "button" value = "Red" onClick={event => setBorder("red")}></input>
              <input name = "bgColor" id = "blueBG" class = "backgroundInput" type = "button" value = "Blue" onClick={event => setBorder("blue")}></input>
              <input name = "bgColor" id = "greenBG" class = "backgroundInput" type = "button" value = "Green" onClick={event => setBorder("green")}></input>
          </div>
          <div class = "borders">
              <h3>Choose a border color:</h3>
              <input name = "borderColor" id = "redBorder" class = "borderInput" type = "button" value = "Red" onClick={event => setBackground("red")}></input>
              <input name = "borderColor" id = "blueBorder" class = "borderInput" type = "button" value = "Blue" onClick={event => setBackground("blue")}></input>
              <input name = "borderColor" id = "greenBorder" class = "borderInput" type = "button" value = "Green" onClick={event => setBackground("green")}></input>
          </div>
          <button type = "submit">Submit your profile picture</button>
        </form>
    </div>
  );
}

export default ProfilePicture;
