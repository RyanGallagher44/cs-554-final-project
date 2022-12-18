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
  Grid,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  ListItemIcon,
  Divider
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
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
  const [openReplies, setOpenReplies] = useState(false);
  const [currentOpenReply, setCurrentOpenReply] = useState(undefined);
  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    fetchFeed();
    setLoading(true);
    setOpen(false);
    setOpenReplies(false);
    setPostSongTitleSearchTerm("");
    setSelectedPostSongTitle("");
    setBodyLength(0);
  }
  const handleOpenReplies = (postId) => {
    setOpenReplies(true);
    setCurrentOpenReply(postId);
    console.log(postData);
    console.log(postData.indexOf(postId));
  }
  const bodyRef = useRef('');
  const [postSongTitleSearchTerm, setPostSongTitleSearchTerm] = useState("");
  const [postSongTitleSearchData, setPostSongTitleSearchData] = useState([]);
  const [selectedPostSongTitle, setSelectedPostSongTitle] = useState("");
  const [loading, setLoading] = useState(true);
  const [postData, setPostData] = useState([]);
  const [bodyLength, setBodyLength] = useState(0);

  async function fetchFeed() {
    try {
      const { data } = await axios.get('http://localhost:3030/posts/all');
      setPostData(data);
      console.log(data);
      setLoading(false);
    } catch (e) {
      console.log(e);
    }
  }
  
  useEffect(() => {
    console.log('fetch useEffect fired');

    if (localStorage.getItem('signup')) {
      window.location.reload();
      localStorage.removeItem('signup');
    }

    async function fetchData() {
      try {
        const { data } = await axios.get('http://localhost:3030/posts/all');
        setPostData(data);
        setLoading(false);
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
      fetchFeed();
    });
  };

  const handleLikePost = async (postId) => {
    const request = {
      userId: currentUser.uid,
      postId: postId
    };
    axios.post('http://localhost:3030/users/like', request)
    .then(response => {
      console.log(response.data);
    })
    .finally(() => {
      fetchFeed();
    })
  };

  const handleUnlikePost = async (postId) => {
    const request = {
      userId: currentUser.uid,
      postId: postId
    };
    axios.post('http://localhost:3030/users/unlike', request)
    .then(response => {
      console.log(response.data);
    })
    .finally(() => {
      fetchFeed();
    })
  };

  const handleAddReply = async (event) => {
    event.preventDefault();

    const request = {
      userId: currentUser.uid,
      postId: currentOpenReply,
      reply: bodyRef.current.value,
      timePosted: new Date(),
      posterName: currentUser.displayName
    };
    axios.post('http://localhost:3030/posts/reply', request)
    .then(response => {
      console.log(response.data);
    })
    .finally(() => {
      bodyRef.current.value = "";
      setBodyLength(0);
      fetchFeed();
    })
  };

  const handleRemoveReply = async (replyId, postId) => {
    const request = {
      replyId: replyId,
      postId: postId
    };
    axios.post('http://localhost:3030/posts/unreply', request)
    .then(response => {
      console.log(response.data);
    })
    .finally(() => {
      fetchFeed();
    })
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
            {post._source.likes.indexOf(currentUser.uid) === -1 &&
              <div className='like-button'>
                <IconButton 
                  aria-label="add to favorites"
                  onClick={() => handleLikePost(post._id)}
                >
                  <FavoriteIcon />
                </IconButton>
                <Typography variant="h6" component="h6" sx={{fontSize: '14px', marginTop: '-10px'}}>
                  {post._source.likes.length}
                </Typography>
              </div>
            }
            {post._source.likes.indexOf(currentUser.uid) !== -1 &&
              <div className='like-button'>
                <IconButton 
                  aria-label="add to favorites"
                  onClick={() => handleUnlikePost(post._id)}
                >
                  <FavoriteIcon sx={{color: 'red'}} />
                </IconButton>
                <Typography variant="h6" component="h6" sx={{fontSize: '14px', marginTop: '-10px'}}>
                  {post._source.likes.length}
                </Typography>
              </div>
            }
            <div className='like-button'>
              <IconButton
                aria-label="comment"
                onClick={() => handleOpenReplies(post._id)}
              >
                <ChatBubbleOutlineIcon />
              </IconButton>
              <Typography variant="h6" component="h6" sx={{fontSize: '14px', marginTop: '-10px'}}>
                {post._source.replies.length}
              </Typography>
            </div>
          </CardActions>
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
        {currentOpenReply &&
          <Modal
            open={openReplies}
            onClose={handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
          >
            <Box sx={style}>
              <Typography id="modal-modal-title" variant="h6" component="h2">
                Replies ({postData[postData.map(function(e) { return e._id; }).indexOf(currentOpenReply)]._source.replies.length})
              </Typography>
              {currentOpenReply &&
                <List sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper', maxHeight: '300px', overflow: 'auto' }}>
                  {postData[postData.map(function(e) { return e._id; }).indexOf(currentOpenReply)]._source.replies.map((reply) => {
                    return(
                      <div>
                        <ListItem alignItems="flex-start">
                          <ListItemAvatar>
                            <Avatar alt={`${reply.posterName.substring(0,1)}`} src="/static/images/avatar/1.jpg" />
                          </ListItemAvatar>
                          <ListItemText
                            primary={reply.posterName}
                            secondary={
                                <Typography
                                  sx={{ display: 'inline' }}
                                  component="span"
                                  variant="body2"
                                  color="text.primary"
                                >
                                  {reply.reply}
                                </Typography>
                            }
                          />
                          {currentUser.uid === reply.posterId &&
                            <ListItemIcon>
                              <IconButton
                                onClick={() => handleRemoveReply(reply.replyId, currentOpenReply)}
                              >
                                <DeleteIcon />
                              </IconButton>
                            </ListItemIcon>
                          }
                        </ListItem>
                        <Divider variant="inset" component="li" />
                      </div>
                  )})}
                </List>
              }
              <form onSubmit={handleAddReply}>
                <div className='form-group'>
                  <TextField
                    fullWidth
                    id="filled-basic"
                    label="Leave a reply"
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
                    onSubmit={handleAddReply}
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
                    Reply
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
        } 
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
