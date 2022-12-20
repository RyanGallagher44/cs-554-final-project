import React, { useRef, useState, useEffect, useContext } from 'react';
import '../App.css';
import { Link, useParams } from 'react-router-dom';
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
  // firebase user
  const {currentUser} = useContext(AuthContext);

  // indicates current state of modals (post creation and reply)
  const [open, setOpen] = useState(false);
  const [openReplies, setOpenReplies] = useState(false);

  // indicates state of currently open reply section for a post
  const [currentOpenReply, setCurrentOpenReply] = useState(undefined);

  //updates profile pictures on feed load
  const [profilePicSource, setProfilePic] = useState(null);

  // modals
  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    fetchFeed();
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

  // reference to body input of post and reply
  const bodyRef = useRef('');

  // indicates state of current input/options for song title when creating a post
  const [postSongTitleSearchTerm, setPostSongTitleSearchTerm] = useState("");
  const [postSongTitleSearchData, setPostSongTitleSearchData] = useState([]);

  // indicates the state of the song title that the user selected when creating a post
  const [selectedPostSongTitle, setSelectedPostSongTitle] = useState("");

  // indicates the state of the page loading
  const [loading, setLoading] = useState(true);

  // indicates the state of the feed data
  const [postData, setPostData] = useState([]);

  // indicates the state of the body length of a post or reply
  const [bodyLength, setBodyLength] = useState(0);

  const [pfpSource, setPfpSource] = useState(0);

  const {page} = useParams();
  const [lastPage, setLastPage] = useState(false);

  // fetches the feed
  async function fetchFeed() {
    try {
      const { data } = await axios.get(`http://localhost:3030/posts/${page}`);
      setPostData(data);
    } catch (e) {
      console.log(e);
    }

    try {
      const { data } = await axios.get(`http://localhost:3030/posts/${page+1}`);

      if (data.length === 0) {
        setLastPage(true);
      }

      setLoading(false);
    } catch (e) {
      setLoading(false);
    }
  }
  
  // fetches the feed upon load
  useEffect(() => {
    if (localStorage.getItem('signup')) {
      window.location.reload();
      localStorage.removeItem('signup');
    }

    if (page) {
      fetchFeed();
    }
  }, [page]);


  // fetches search results for song title when creating a post
  useEffect(() => {
    async function fetchData() {
      try {
        const { data } = await axios.get(`http://localhost:3030/lastfm/tracks/search/${postSongTitleSearchTerm}`);
        setPostSongTitleSearchData(data);
      } catch (e) {
        console.log(e);
      }
    }

    if (postSongTitleSearchTerm) {
      fetchData();
    }
  }, [postSongTitleSearchTerm]);

  // handles the change of body length when user is typing a post or reply
  const handleBodyChange = (event) => {
    setBodyLength(event.target.value.length);
  };

  // handles the post creation
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

  // handles changing the state of the song title when creating a post
  const handleChange = (event) => {
    setPostSongTitleSearchTerm(event.target.value);
  };

  // handles changing the state of the selected song title when creating a post
  const handleChange2 = (event) => {
    setSelectedPostSongTitle(event.target.textContent);
  };

  // handles deleting a post
  const handleDeletePost = async (postId) => {
    axios.delete(`http://localhost:3030/posts/delete/${postId}`)
    .then(response => {
      console.log(response.data);
    })
    .finally(() => {
      fetchFeed();
    });
  };

  // handles liking a post
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

  // handles unliking a post
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

  // handles creating a reply to a post
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

  // handles removing a reply from a post
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

  // builds a post for the feed
  const buildPost = (post) => {
    return (
      <Grid item xs={3} key={post._id}>
        <Card sx={{ width: 300 }}>
          {currentUser.uid === post._source.posterId &&
              <CardHeader
                avatar={
                  <img class = "profPictureDisplay" src = {`http://localhost:3030/users/img/profilePicture_${post._source.posterId}.jpg`}/>
                }
                action={
                  <IconButton
                    aria-label="settings"
                    onClick={() => handleDeletePost(post._id)}
                  >
                    <DeleteIcon />
                  </IconButton>
                }
                sx={{
                  textAlign: 'left'
                }}
                title={
                  <Link to={`/profile/${post._source.posterId}`}>
                    {post._source.posterUsername}
                  </Link>
                }
                subheader={`${new Date(post._source.timePosted).toLocaleDateString()} @ ${new Date(post._source.timePosted).toLocaleTimeString()}`}
              />
          }
          {currentUser.uid !== post._source.posterId &&
              <CardHeader
                avatar={
                  <img class = "profPictureDisplay" src = {`http://localhost:3030/users/img/profilePicture_${post._source.posterId}.jpg`}/>
                }
                sx={{
                  textAlign: 'left'
                }}
                title={
                  <Link to={`/profile/${post._source.posterId}`}>
                    {post._source.posterUsername}
                  </Link>
                }
                subheader={`${new Date(post._source.timePosted).toLocaleDateString()} @ ${new Date(post._source.timePosted).toLocaleTimeString()}`}
              />
          }
          <CardContent
            sx={{
              textAlign: 'left'
            }}
          >
            <Link to={`/artist/${post._source.artistId}`}>
              <Box
                display="flex"
                alignItems="center"
              >
                <Avatar sx={{margin: '5px'}} src={`${post._source.artistImage}`} alt={`${post._source.artistName}`} />
                <Typography variant="body2" color="text.secondary" sx={{fontStyle: 'italic', marginLeft: '5px'}}>
                  {post._source.songName} by {post._source.artistName}
                </Typography>
              </Box>
            </Link>
            <Divider />
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
      <div className="loading">
        <br />
        <br />
        <br />
        <br />
        <br />
        <img
            width="200px"
            src={require('../images/loading.gif')}
        />
      </div>
    );
  } else {
    return (
      <div className='home'>
        <h2>Hello, {currentUser.displayName.split(" ")[0]}</h2>
        <br />
        <div>
          <div className="fab">
            <Fab
              onClick={handleOpen}
              sx={{
                marginRight: '2.5%',
                backgroundColor: '#A2E4B8'
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
              <Typography id="modal-modal-title" variant="h6" component="h2"
                sx={{
                  color: 'black'
                }}
              >
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
                  <Typography id="modal-modal-title" variant="h6" component="h2" sx={{margin: '10px', color: 'black'}}>
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
          {currentOpenReply && postData.length !== 0 &&
            <Modal
              open={openReplies}
              onClose={handleClose}
              aria-labelledby="modal-modal-title"
              aria-describedby="modal-modal-description"
            >
              <Box sx={style}>
                <Typography id="modal-modal-title" variant="h6" component="h2"
                  sx={{
                    color: 'black'
                  }}
                >
                  Replies ({postData[postData.map(function(e) { return e._id; }).indexOf(currentOpenReply)]._source.replies.length})
                </Typography>
                {currentOpenReply &&
                  <List sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper', maxHeight: '300px', overflow: 'auto' }}>
                  {postData[postData.map(function(e) { return e._id; }).indexOf(currentOpenReply)]._source.replies.map((reply) => {
                    return(
                      <div>
                        <ListItem alignItems="flex-start">
                          <ListItemAvatar>
                              <img class = "profPictureDisplay" src = {`http://localhost:3030/users/img/profilePicture_${reply.posterId}.jpg`}/>
                          </ListItemAvatar>
                          <ListItemText
                            sx={{
                              color: 'black'
                            }}
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
                    <Typography id="modal-modal-title" variant="h6" component="h2" sx={{margin: '10px', color: 'black'}}>
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
          {postData.length !== 0 &&
            <div>
              <Typography>
                Find out what others are listening to!
              </Typography>
              <br />
              <Grid
                  container
                  spacing={5}
                  direction="column"
                  alignItems="center"
                  justifyContent="center"
              >
                  {postData.map((post) => {
                      console.log(postData);
                      return buildPost(post);
                  })}
              </Grid>
            </div>
          }
          {postData.length === 0 &&
            <Typography>
              No feed to display at this time.  Write a post!
            </Typography>
          } 
        </div>
      </div>
    );
  }
}

export default Home;
