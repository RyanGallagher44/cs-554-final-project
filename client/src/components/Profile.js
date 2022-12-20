import React, { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import '../App.css';
import ChangePassword from './ChangePassword';
import ProfilePicture from './ProfilePicture';
import { AuthContext } from '../firebase/Auth';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import {
  Box,
  Stack,
  List,
  ListItem,
  ListItemAvatar,
  Avatar,
  ListItemText,
  Divider,
  ListItemIcon,
  IconButton
} from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';

function Profile() {
  const {currentUser} = useContext(AuthContext);
  const [userData, setUserData] = useState(undefined);
  const [loading, setLoading] = useState(true);
  const {id} = useParams();

  useEffect(() => {
    async function fetchUser() {
      try {
          const { data } = await axios.get(`http://localhost:3030/users/expanded/${id}`);
          setUserData(data);
          console.log(data);
          setLoading(false);
      } catch (e) {
          setLoading(false);
      }
    }

    if (id) {
      fetchUser();
    }
  }, [id]);

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
    )
  } else {
    return (
      <div className='profile'>
        <h2>{`${userData.fullName}'s Profile`}</h2>
        <Box
            display="flex"
            justifyContent="center"
        >
            <Stack
                sx={{
                    margin: '50px',
                    alignItems: 'center'
                }}
            >
                <h2>Favorite Artists ({userData.likedArtists.length})</h2>
                {userData.likedArtistsExpanded.length !== 0 &&
                    <List sx={{maxHeight: '300px', overflow: 'auto', width: '300px', bgcolor: 'background.paper', color: 'black', borderRadius: '10px'}}>
                        {userData.likedArtistsExpanded.map((artist) => {
                            return(
                                <div>
                                    {artist.mbid &&
                                        <Link to={`/artist/${artist.mbid}`}>
                                            <ListItem>
                                                <ListItemAvatar>
                                                    <Avatar alt={`${artist.name}`} src={`${artist.image}`} />
                                                </ListItemAvatar>
                                                <ListItemText
                                                    primary={artist.name}
                                                />
                                            </ListItem>
                                        </Link>
                                    }
                                    {!artist.mbid &&
                                        <ListItem>
                                            <ListItemAvatar>
                                                <Avatar alt={`${artist.name}`} src={`${artist.image}`} />
                                            </ListItemAvatar>
                                            <ListItemText
                                                primary={artist.name}
                                            />
                                        </ListItem>
                                    }
                                    <Divider variant="inset" component="li" />
                                </div>
                            )})
                        }
                    </List>
                }
                {userData.likedArtistsExpanded.length === 0 &&
                    <List sx={{maxHeight: '300px', overflow: 'auto', width: '300px', bgcolor: 'background.paper', color: 'black', borderRadius: '10px'}}>
                          <ListItem>
                              <ListItemText
                                sx={{
                                  textAlign: 'center'
                                }}
                                  primary='You have not favorited any artists yet!'
                              />
                          </ListItem>    
                    </List>
                }
            </Stack>

            <Stack
                sx={{
                    margin: '50px',
                    alignItems: 'center'
                }}
            >
                <h2>Favorite Albums ({userData.likedAlbums.length})</h2>
                {userData.likedAlbumsExpanded.length !== 0 &&
                    <List sx={{maxHeight: '300px', overflow: 'auto', width: '300px', bgcolor: 'background.paper', color: 'black', borderRadius: '10px'}}>
                        {userData.likedAlbumsExpanded.map((album) => {
                            return(
                                <div>
                                    {album.mbid &&
                                        <Link to={`/album/${album.mbid}`}>
                                            <ListItem>
                                                <ListItemAvatar>
                                                    <Avatar alt={`${album.name}`} src={`${album.image}`} />
                                                </ListItemAvatar>
                                                <ListItemText
                                                    primary={album.name}
                                                />
                                            </ListItem>
                                        </Link>
                                    }
                                    {!album.mbid &&
                                        <ListItem>
                                            <ListItemAvatar>
                                                <Avatar alt={`${album.name}`} src={`${album.image}`} />
                                            </ListItemAvatar>
                                            <ListItemText
                                                primary={album.name}
                                            />
                                        </ListItem>
                                    }
                                    <Divider variant="inset" component="li" />
                                </div>
                            )})
                        }
                    </List>
                }
                {userData.likedAlbumsExpanded.length === 0 &&
                    <List sx={{maxHeight: '300px', overflow: 'auto', width: '300px', bgcolor: 'background.paper', color: 'black', borderRadius: '10px'}}>
                          <ListItem>
                              <ListItemText
                                sx={{
                                  textAlign: 'center'
                                }}
                                  primary='You have not favorited any albums yet!'
                              />
                          </ListItem>    
                    </List>
                }
            </Stack>
        </Box>
        {currentUser.uid === userData.uid &&
          <div>
            <ChangePassword />
            <ProfilePicture />
          </div>
        }
      </div>
    );
  }
}

export default Profile;
