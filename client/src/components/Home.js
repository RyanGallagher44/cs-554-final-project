import React, { useRef, useState, useEffect, useContext } from 'react';
import '../App.css';
import { styled } from '@mui/material/styles';
import { redirect } from 'react-router-dom';
import {
  Button,
  Modal,
  Box,
  Typography,
  TextField,
  Autocomplete,
  CircularProgress,
  Fab,
  Card,
  CardHeader,
  Avatar,
  CardContent,
  CardActions,
  Collapse,
  IconButton,
  Grid
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ShareIcon from '@mui/icons-material/Share';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import DeleteIcon from '@mui/icons-material/Delete';
import axios from 'axios';
import { AuthContext } from '../firebase/Auth';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
  borderRadius: '10px'
};

function Home() {
  const {currentUser} = useContext(AuthContext);
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setLoading(true);
    setOpen(false);
    setPostSongTitleSearchTerm("");
    setSelectedPostSongTitle("");
    setBodyLength(0);
  }
  const bodyRef = useRef('');
  const [postSongTitleSearchTerm, setPostSongTitleSearchTerm] = useState("");
  const [postSongTitleSearchData, setPostSongTitleSearchData] = useState([]);
  const [selectedPostSongTitle, setSelectedPostSongTitle] = useState("");
  const [loading, setLoading] = useState(true);
  const [postData, setPostData] = useState([]);
  const [bodyLength, setBodyLength] = useState(0);
  const [expanded, setExpanded] = useState(false);

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  const ExpandMore = styled((props) => {
    const { expand, ...other } = props;
    return <IconButton {...other} />;
  })(({ theme, expand }) => ({
    transform: !expand ? 'rotate(0deg)' : 'rotate(180deg)',
    marginLeft: 'auto',
    transition: theme.transitions.create('transform', {
      duration: theme.transitions.duration.shortest,
    }),
  }));


  useEffect(() => {
    console.log('fetch useEffect fired');
    async function fetchData() {
      try {
        const { data } = await axios.get('http://localhost:3030/posts/all');
        setPostData(data);
        console.log(data);
        setLoading(false);
  
        return data;
      } catch (e) {
        console.log(e);
      }
    }

    fetchData();
  }, [loading]);

  useEffect(() => {
    async function fetchData() {
      try {
        const { data } = await axios.get(`http://localhost:3030/lastfm/tracks/search/${postSongTitleSearchTerm}`);
        setPostSongTitleSearchData(data);
        console.log(data);
      } catch (e) {
        console.log(e);
      }
    }

    if (postSongTitleSearchTerm) {
      fetchData();
    }
  }, [postSongTitleSearchTerm]);

  const handleBodyChange = (event) => {
    setBodyLength(event.target.value.length);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    let selectedPostSongTitleSplit = selectedPostSongTitle.split(" - ");
    const request = {
      posterId: currentUser.uid,
      posterUsername: currentUser.displayName,
      timePosted: new Date(),
      body: bodyRef.current.value,
      songName: selectedPostSongTitleSplit[0],
      artistName: selectedPostSongTitleSplit[selectedPostSongTitleSplit.length-1]
    }
    axios.post('http://localhost:3030/posts/upload', request)
    .then(response => {
      console.log(response.data);
    })
    .finally(() => {
      handleClose();
      return redirect("/home");
    });
  };

  const handleChange = (event) => {
    setPostSongTitleSearchTerm(event.target.value);
  };

  const handleChange2 = (event) => {
    setSelectedPostSongTitle(event.target.textContent);
  };

  const handleDeletePost = async (postId) => {
    axios.delete(`http://localhost:3030/posts/delete/${postId}`)
    .then(response => {
      console.log(response.data);
    })
    .finally(() => {
      
    });
  };

  const buildPost = (post) => {
    return (
      <Grid item xs={3} key={post._id}>
        <Card sx={{ width: 300 }}>
          {currentUser.uid === post._source.posterId &&
            <CardHeader
              avatar={
                <Avatar aria-label="recipe">
                  {post._source.posterUsername.substring(0,1)}
                </Avatar>
              }
              action={
                <IconButton
                  aria-label="settings"
                  onClick={() => handleDeletePost(post._id)}
                >
                  <DeleteIcon />
                </IconButton>
              }
              title={post._source.posterUsername}
              subheader={`${new Date(post._source.timePosted).toLocaleDateString()} @ ${new Date(post._source.timePosted).toLocaleTimeString()}`}
            />
          }
          {currentUser.uid !== post._source.posterId &&
            <CardHeader
              avatar={
                <Avatar aria-label="recipe">
                  {post._source.posterUsername.substring(0,1)}
                </Avatar>
              }
              title={post._source.posterUsername}
              subheader={`${new Date(post._source.timePosted).toLocaleDateString()} @ ${new Date(post._source.timePosted).toLocaleTimeString()}`}
            />
          }
          <CardContent>
            <Typography variant="body2" color="text.secondary" sx={{fontStyle: 'italic'}}>
              {post._source.songName} by {post._source.artistName}
            </Typography>
            <br />
            <Typography variant="body2" color="text.secondary">
              {post._source.body}
            </Typography>
          </CardContent>
          <CardActions disableSpacing>
            <IconButton aria-label="add to favorites">
              <FavoriteIcon />
            </IconButton>
            <IconButton aria-label="share">
              <ShareIcon />
            </IconButton>
            <ExpandMore
              expand={expanded}
              onClick={handleExpandClick}
              aria-expanded={expanded}
              aria-label="show more"
            >
              <ExpandMoreIcon />
            </ExpandMore>
          </CardActions>
          <Collapse in={expanded} timeout="auto" unmountOnExit>
            <CardContent>
              <Typography variant="body2" color="text.secondary">
                Leave a Reply
              </Typography>
            </CardContent>
          </Collapse>
        </Card>
      </Grid>
    );
  };

  if (loading) {
    return(
      <div>
        <h2>Loading...</h2>
      </div>
    );
  } else {
    return (
      <div>
        <h2>Hello, {currentUser.displayName.split(" ")[0]}</h2>
        <div className="fab">
          <Fab
            onClick={handleOpen}
            sx={{
              marginRight: '2.5%'
            }}
          >
            <EditIcon />
          </Fab>
        </div>
        <Modal
          open={open}
          onClose={handleClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={style}>
            <Typography id="modal-modal-title" variant="h6" component="h2">
              What are you listening to?
            </Typography>
            <form onSubmit={handleSubmit}>
              <Autocomplete
                value={selectedPostSongTitle}
                options={postSongTitleSearchData}
                onInputChange={handleChange}
                onChange={handleChange2}
                fullWidth
                disableClearable
                renderInput={(params) => (
                  <TextField
                    {...params}
                    InputProps={{
                      ...params.InputProps,
                      placeholder: "Enter song title",
                      disableunderline: 'true'
                    }}
                    required
                  />
                )}
                getOptionLabel={(option) => option}
                sx={{
                  marginTop: '10px',
                  marginBottom: '10px'
                }}
              />
              <div className='form-group'>
                <TextField
                  fullWidth
                  id="filled-basic"
                  label="Your thoughts?"
                  variant="filled"
                  type="text"
                  onChange={handleBodyChange}
                  inputRef={bodyRef}
                  required
                  multiline
                  inputProps={{maxLength: 100}}
                />
              </div>
              <div className="post-submit-div">
                <Button
                  id='submitButton'
                  onSubmit={handleSubmit}
                  type='submit'
                  sx={{
                    '&:hover': {
                      backgroundColor: '#000000',
                      color: '#ffffff'
                    },
                    textTransform: 'none',
                    backgroundColor: '#1f1f1f',
                    color: '#e1e1e1',
                    width: '100px'
                  }}
                >
                  Post
                </Button>
                <Typography id="modal-modal-title" variant="h6" component="h2" sx={{margin: '10px'}}>
                  {bodyLength}/100
                </Typography>
                <CircularProgress
                  variant="determinate"
                  value={bodyLength}
                />
              </div>
            </form>
          </Box>
        </Modal>
        <Grid
            container
            spacing={5}
            direction="column"
            alignItems="center"
            justifyContent="center"
        >
            {postData.map((post) => {
                return buildPost(post);
            })}
        </Grid>
      </div>
    );
  }
}

export default Home;
