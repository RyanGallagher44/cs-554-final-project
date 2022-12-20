import React, {useState, useEffect, useContext} from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import {
    List,
    ListItem,
    ListItemAvatar,
    ListItemText,
    Typography,
    Divider,
    Avatar,
    Stack,
    Grid,
    IconButton,
    Box
} from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import parse from 'html-react-parser';
import { AuthContext } from '../firebase/Auth';

const Album = () => {
    const {currentUser} = useContext(AuthContext);
    const [userData, setUserData] = useState(undefined);
    const [albumData, setAlbumData] = useState(undefined);
    const [loading, setLoading] = useState(true);
    const {id} = useParams();

    async function fetchUser() {
        try {
            const { data } = await axios.get(`http://localhost:3030/users/${currentUser.uid}`);
            setUserData(data);
        } catch (e) {
            setLoading(false);
        }
    }

    useEffect(() => {
        async function fetchData() {
            try {
                const { data } = await axios.get(`http://localhost:3030/lastfm/albums/${id}`);
                setAlbumData(data);
                setLoading(false);
            } catch (e) {
                setLoading(false);
            }
        }

        if (id) {
            fetchUser();
            fetchData();
        }
    }, [id]);

    const handleLikeAlbum = async (mbid) => {
        const request = {
          userId: currentUser.uid,
          mbid: mbid
        };
        axios.post('http://localhost:3030/users/likeAlbum', request)
        .then(response => {
          console.log(response.data);
        })
        .finally(() => {
            fetchUser();
        })
      };
    
      const handleUnlikeAlbum = async (mbid) => {
        const request = {
          userId: currentUser.uid,
          mbid: mbid
        };
        axios.post('http://localhost:3030/users/unlikeAlbum', request)
        .then(response => {
          console.log(response.data);
        })
        .finally(() => {
          fetchUser();
        })
      };

    if (loading) {
        return(
            <div className='loading'>
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
        return(
            <div className='artist'>
                <Grid alignItems="center" container>
                    <Grid xs={12} sm={12} md={6} lg={6} xl={6} item>
                        <Stack alignItems="center"
                            sx={{
                                padding: '50px'
                            }}
                        >
                            <img
                                width="300px"
                                className='album-img'
                                src={albumData.image}
                                alt={albumData.name}
                            />
                            <br />
                            <Typography>
                                {albumData.name}
                            </Typography>
                            <Typography>
                                Last.fm Listeners: {albumData.numListeners}
                            </Typography>
                            <Typography>
                                Last.fm Play Count: {albumData.playCount}
                            </Typography>
                            <br />
                            <Typography>
                                Tracks
                            </Typography>
                            <List sx={{width: '500px', bgcolor: 'background.paper', color: 'black', maxHeight: '300px', overflow: 'auto', borderRadius: '10px'}}>
                                {albumData.tracks.map((track) => {
                                    return(
                                        <div>
                                            <ListItem
                                                secondaryAction={
                                                    <ListItemText
                                                        primary={track.duration}
                                                    />
                                                }
                                            >
                                                <ListItemText
                                                    primary={`${track.rank} ${track.name}`}
                                                />
                                            </ListItem>
                                            <Divider component="li" />
                                        </div>
                                    )})
                                }
                            </List>
                            <br />
                            <Box
                                display="flex"
                                alignItems="center"
                            >
                                {!userData.likedAlbums.includes(albumData.mbid) &&
                                    <div>
                                        <IconButton
                                            aria-label="add to favorites"
                                            onClick={() => handleLikeAlbum(albumData.mbid)}
                                        >
                                            <FavoriteIcon
                                                sx={{
                                                    fontSize: '50px'
                                                }}
                                            />
                                        </IconButton>
                                        <Typography>
                                            Favorite this Album
                                        </Typography>
                                    </div>
                                }
                                {userData.likedAlbums.includes(albumData.mbid) &&
                                    <div>
                                        <IconButton
                                            aria-label="remove from favorites"
                                            onClick={() => handleUnlikeAlbum(albumData.mbid)}
                                        >
                                            <FavoriteIcon
                                                sx={{
                                                    fontSize: '50px',
                                                    color: 'red'
                                                }}
                                            />
                                        </IconButton>
                                        <Typography>
                                            Remove from Favorites
                                        </Typography>
                                    </div>
                                }
                            </Box>
                        </Stack>
                    </Grid>
                    <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                            <Typography
                                sx={{
                                    padding: '50px'
                                }}
                            >
                                {parse(albumData.bio)}
                            </Typography>
                    </Grid>
                </Grid>
            </div>
        );
    }
};
export default Album;