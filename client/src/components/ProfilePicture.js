import React, {useState, useContext} from 'react';
import '../App.css';
import guitar from './pictures/guitar.jpg'
import headphones from './pictures/headphones.jpg'
import musicnote from './pictures/musicnote.jpg'
import axios from 'axios'
import {AuthContext} from '../firebase/Auth';
import { ColorPicker, useColor } from "react-color-palette";
import "react-color-palette/lib/css/styles.css";
import {
  Button,
  Modal,
  Box,
  Typography,
  TextField,
  Autocomplete,
  CircularProgress,
  Fab,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';


function ProfilePicture() {
  const {currentUser} = useContext(AuthContext);
  const [picture, setPicture] = useState("");
  const [borderColor, setBorder] = useColor("hex", "#121212");
  const [backgroundColor, setBackground] = useColor("hex", "#121212");
  const [open, setOpen] = useState(false);

  const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    bgcolor: 'background.paper',
    border: '2px solid #000',
    width: '1000px',
    height: '600px',
    boxShadow: 24,
    p: 4,
    borderRadius: '10px'
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    console.log(picture)
    console.log(backgroundColor)
    console.log(borderColor)

    handleClose();
    axios.get(`http://localhost:3030/image/generate/${picture}/${backgroundColor.hex.substring(1)}/${borderColor.hex.substring(1)}/${currentUser.uid}`)
    window.location.reload();
  }

  const onBackgroundChange = (backgroundColor) =>{
    setBackground(backgroundColor)
  }

  const onBorderChange = (borderColor) =>{
    setBorder(borderColor)
  }

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <div>
        
        <Button
          onClick={handleOpen}
          sx={{
            backgroundColor: '#A2E4B8',
            color: 'black',
            '&:hover': {
              backgroundColor: 'white'
            },
          }}
        >
          Change your Profile Picture
        </Button>
        <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
          >
            <Box sx={style}>
              <Typography class = "picModalHeader" variant="h6" component="h2"
                sx={{
                  color: 'black'
                }}
              >
                Customize your own profile picture!
              </Typography>
              <form onSubmit={handleSubmit}>
              <div class = "profModal">
                <div class = "pictures">
                  <h3>Choose a picture:</h3>
                      <div class = "pictureSubGuitar">
                        <img class = "profPic" src = {guitar}/>
                        <input name="picSrc" id="guitar" class = "picInputGuitar" type = "button" value = "Guitar" onClick={event => setPicture("guitar")}></input>
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
                  <div class = "colorPicker">
                      <h3 class = "pickerSub">Choose a background color:</h3>
                      <ColorPicker width={300} height={200} 
                          color={backgroundColor} 
                          onChange={onBackgroundChange} hideHSV dark />;          
                  </div>
                  <div class = "colorPicker">
                      <h3 class = "pickerSub">Choose a border color:</h3>
                      <ColorPicker width={300} height={200} 
                          color={borderColor} 
                          onChange={onBorderChange} hideHSV dark />;          
                  </div>
                </div>
                <button class = "profSubmit" type = "submit">Submit your profile picture</button>
              </form>
            </Box>
          </Modal>
        <form onSubmit = {handleSubmit}>
          
        </form>
    </div>
  );
}

export default ProfilePicture;
