import React, { useRef, useState, useEffect, useContext } from 'react';
import '../App.css';
import { Link } from 'react-router-dom';
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
  Divider,
  CardActionArea,
  CardMedia
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import DeleteIcon from '@mui/icons-material/Delete';
import axios from 'axios';
import { AuthContext } from '../firebase/Auth';
import SearchArtists from './SearchArtists';
import noImage from '../images/noImage.png';
import SearchAlbums from './SearchAlbums';

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

  const [searchArtistsData, setSearchArtistsData] = useState(undefined);
  const [searchArtistTerm, setSearchArtistTerm] = useState("");

  const [searchAlbumsData, setSearchAlbumsData] = useState(undefined);
  const [searchAlbumTerm, setSearchAlbumTerm] = useState("");

  useEffect(() => {
    setSearchArtistsData([]);
    async function fetchData() {
        try {
            const { data } = await axios.get(`http://localhost:3030/lastfm/artists/search/${searchArtistTerm}`);
            setSearchArtistsData(data);
            console.log(data);
            setLoading(false);
        } catch (e) {
            console.log(e);
        }
    }

    if (searchArtistTerm) {
        fetchData();
    }
  }, [searchArtistTerm]);

  const searchArtistValue = async (value) => {
      setSearchArtistTerm(value);
  };

  useEffect(() => {
    setSearchAlbumsData([]);
    async function fetchData() {
        try {
            const { data } = await axios.get(`http://localhost:3030/lastfm/albums/search/${searchAlbumTerm}`);
            setSearchAlbumsData(data);
            console.log(data);
            setLoading(false);
        } catch (e) {
            console.log(e);
        }
    }

    if (searchAlbumTerm) {
        fetchData();
    }
  }, [searchAlbumTerm]);

  const searchAlbumValue = async (value) => {
      setSearchAlbumTerm(value);
  };

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
              sx={{
                textAlign: 'left'
              }}
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
              sx={{
                textAlign: 'left'
              }}
              title={post._source.posterUsername}
              subheader={`${new Date(post._source.timePosted).toLocaleDateString()} @ ${new Date(post._source.timePosted).toLocaleTimeString()}`}
            />
          }
          <CardContent
            sx={{
              textAlign: 'left'
            }}  
          >
            <Typography variant="body2" color="text.secondary" sx={{fontStyle: 'italic'}}>
              {post._source.songName} by {post._source.artistName}
            </Typography>
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

  const buildArtistCard = (artist) => {
    return(
      <Grid item xs={12} sm={6} md={4} lg={3} xl={2} key={artist.mbid}>
          <Card
              sx={{
                  margin: '20px'
              }}
          >
              <CardActionArea>
                {artist.mbid &&
                  <Link className="artist-link" to={`/artist/${artist.mbid}`}>
                      <CardMedia
                          component="img"
                          src={
                              `${artist.image}`
                          }
                          title={`${artist.name}`}
                          onError={(e) => {
                              e.target.src = noImage;
                          }}
                      />
                      <CardContent>
                          <Typography
                              gutterBottom
                              variant="h6"
                              component="h2"
                          >
                              {`${artist.name}`}
                          </Typography>
                          <Typography
                              gutterBottom
                              variant="h6"
                              component="h2"
                          >
                              Last.fm Listeners: {`${artist.numListeners}`}
                          </Typography>
                      </CardContent>
                  </Link>
                }
                {!artist.mbid &&
                  <div>
                    <CardMedia
                        component="img"
                        src={
                            `${artist.image}`
                        }
                        title={`${artist.name}`}
                        onError={(e) => {
                            e.target.src = noImage;
                        }}
                    />
                    <CardContent>
                        <Typography
                            gutterBottom
                            variant="h6"
                            component="h2"
                        >
                            {`${artist.name}`}
                        </Typography>
                        <Typography
                            gutterBottom
                            variant="h6"
                            component="h2"
                        >
                            Last.fm Listeners: {`${artist.numListeners}`}
                        </Typography>
                        <Typography
                            gutterBottom
                            variant="h6"
                            component="h2"
                            sx={{
                              fontSize: '14px'
                            }}
                        >
                            *this artist does not have a page
                        </Typography>
                    </CardContent>
                  </div>
                }
              </CardActionArea>
          </Card>
      </Grid>
    );
  };

  const buildAlbumCard = (album) => {
    return(
      <Grid item xs={12} sm={6} md={4} lg={3} xl={2} key={album.mbid}>
          <Card
              sx={{
                  margin: '20px'
              }}
          >
              <CardActionArea>
                {album.mbid &&
                  <Link className="artist-link" to={`/album/${album.mbid}`}>
                      <CardMedia
                          component="img"
                          src={
                              `${album.image}`
                          }
                          title={`${album.name}`}
                          onError={(e) => {
                              e.target.src = noImage;
                          }}
                      />
                      <CardContent>
                          <Typography
                              gutterBottom
                              variant="h6"
                              component="h2"
                          >
                              {`${album.name}`}
                          </Typography>
                          <Typography
                              gutterBottom
                              variant="h6"
                              component="h2"
                          >
                              {`${album.artist}`}
                          </Typography>
                      </CardContent>
                  </Link>
                }
                {!album.mbid &&
                  <div>
                    <CardMedia
                        component="img"
                        src={
                            `${album.image}`
                        }
                        title={`${album.name}`}
                        onError={(e) => {
                            e.target.src = noImage;
                        }}
                    />
                    <CardContent>
                        <Typography
                            gutterBottom
                            variant="h6"
                            component="h2"
                        >
                            {`${album.name}`}
                        </Typography>
                        <Typography
                            gutterBottom
                            variant="h6"
                            component="h2"
                        >
                            {`${album.artist}`}
                        </Typography>
                        <Typography
                            gutterBottom
                            variant="h6"
                            component="h2"
                            sx={{
                              fontSize: '14px'
                            }}
                        >
                            *this album does not have a page
                        </Typography>
                    </CardContent>
                  </div>
                }
              </CardActionArea>
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
      <div className='home'>
        <h2>Hello, {currentUser.displayName.split(" ")[0]}</h2>
        {!searchAlbumTerm &&
          <SearchArtists searchValue={searchArtistValue} />
        }
        {!searchArtistTerm &&
          <SearchAlbums searchValue={searchAlbumValue} />
        }
        <br />
        <br />
        <br />
        {!searchArtistTerm && !searchAlbumTerm &&
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
                              <Avatar alt={`${reply.posterName.substring(0,1)}`} src="/static/images/avatar/1.jpg" />
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
        }
        {searchArtistTerm && searchArtistsData.length !== 0 &&
          <Grid container justifyContent="center" spacing={5}>
            {searchArtistsData &&
                searchArtistsData.map((artist) => {
                    return buildArtistCard(artist);
                })
            }
          </Grid>
        }
        {searchArtistTerm && searchArtistsData.length === 0 &&
          <div>
            There are no results that match your search!
          </div>
        }
        {searchAlbumTerm && searchAlbumsData.length !== 0 &&
          <Grid container justifyContent="center" spacing={5}>
            {searchAlbumsData &&
                searchAlbumsData.map((album) => {
                    return buildAlbumCard(album);
                })
            }
          </Grid>
        }
        {searchAlbumTerm && searchAlbumsData.length === 0 &&
          <div>
            There are no results that match your search!
          </div>
        }
      </div>
    );
  }
}

export default Home;
