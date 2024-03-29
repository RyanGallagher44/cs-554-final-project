import React, {useState, useEffect, useContext} from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Link } from 'react-router-dom';
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
    Box,
    Card,
    CardMedia,
    Chip
} from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import parse from 'html-react-parser';
import { AuthContext } from '../firebase/Auth';
import Carousel from 'react-material-ui-carousel';
import noImage from '../images/noImage.png';

const Artist = () => {
    const {currentUser} = useContext(AuthContext);
    const [userData, setUserData] = useState(undefined);
    const [artistData, setArtistData] = useState(undefined);
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
                const { data } = await axios.get(`http://localhost:3030/users/${currentUser.uid}`);
                setUserData(data);
            } catch (e) {
                setLoading(false);
            }

            try {
                const { data } = await axios.get(`http://localhost:3030/lastfm/artists/${id}`);
                setArtistData(data);
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

    const handleLikeArtist = async (mbid) => {
        const request = {
            userId: currentUser.uid,
            mbid: mbid
        };
        axios.post('http://localhost:3030/users/likeArtist', request)
        .then(response => {
            console.log(response.data);
        })
        .finally(() => {
            fetchUser();
        })
    };

    const handleUnlikeArtist = async (mbid) => {
        const request = {
            userId: currentUser.uid,
            mbid: mbid
        };
        axios.post('http://localhost:3030/users/unlikeArtist', request)
        .then(response => {
            console.log(response.data);
        })
        .finally(() => {
            fetchUser();
        })
    };

    const Item = (props) => {
        return(
            <div>
                {props.item.mbid &&
                    <Link className="artist-link" to={`/album/${props.item.mbid}`}>
                        <Card variant="outlined"
                            sx={{
                                marginLeft: '25%',
                                maxWidth: '50%',
                                maxHeight: '50%',
                                alignItems: 'center',
                                alignContent: 'center',
                                textAlign: 'center'
                            }}
                        >
                            <CardMedia
                                className="media"
                                component="img"
                                image={
                                    props.item.image
                                        ? props.item.image
                                        : noImage
                                }
                                title="album image"
                            />
                        </Card>
                    </Link>
                }
                {!props.item.mbid &&
                    <Card variant="outlined"
                        sx={{
                            marginLeft: '25%',
                            maxWidth: '50%',
                            maxHeight: '50%',
                            alignItems: 'center',
                            alignContent: 'center',
                            textAlign: 'center'
                        }}
                    >
                        <CardMedia
                            className="media"
                            component="img"
                            image={
                                props.item.image
                                    ? props.item.image
                                    : noImage
                            }
                            title="album image"
                        />
                    </Card>
                }
            </div>
        );
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
                                className='artist-img'
                                src={artistData.image}
                                alt={artistData.name}
                            />
                            <br />
                            <Typography>
                                {artistData.name}
                            </Typography>
                            <Typography>
                                Last.fm Listeners: {artistData.numListeners}
                            </Typography>
                            <Typography>
                                Last.fm Play Count: {artistData.playCount}
                            </Typography>
                            <br />
                            <Typography>
                                Similar Artists
                            </Typography>
                            <List sx={{maxWidth: 360, bgcolor: 'background.paper', color: 'black', borderRadius: '10px'}}>
                                {artistData.similarArtists.map((artist) => {
                                    return(
                                        <div>
                                            <ListItem>
                                                <ListItemAvatar>
                                                    <Avatar alt={`${artist.name}`} src={`${artist.image}`} />
                                                </ListItemAvatar>
                                                <ListItemText
                                                    primary={artist.name}
                                                />
                                            </ListItem>
                                            <Divider variant="inset" component="li" />
                                        </div>
                                    )})
                                }
                            </List>
                            <br />
                            <Box
                                display="flex"
                                alignItems="center"
                            >
                                {!userData.likedArtists.includes(artistData.mbid) &&
                                    <div>
                                        <IconButton
                                            aria-label="add to favorites"
                                            onClick={() => handleLikeArtist(artistData.mbid)}
                                        >
                                            <FavoriteIcon
                                                sx={{
                                                    fontSize: '50px'
                                                }}
                                            />
                                        </IconButton>
                                        <Typography>
                                            Favorite this Artist
                                        </Typography>
                                    </div>
                                }
                                {userData.likedArtists.includes(artistData.mbid) &&
                                    <div>
                                        <IconButton
                                            aria-label="remove from favorites"
                                            onClick={() => handleUnlikeArtist(artistData.mbid)}
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
                        {artistData.tags.map((tag) => {
                            return <Chip key={Math.random()} sx={{color: 'black', backgroundColor: '#A2E4B8', margin: '10px'}} label={tag} />
                        })}
                        <Stack
                            alignItems="center"
                        >
                            <Typography
                                sx={{
                                    padding: '50px'
                                }}
                            >
                                {parse(artistData.bio)}
                            </Typography>
                        </Stack>
                        <Box
                            alignItems="center"
                            textAlign="center"
                            justifyContent="center"
                        >
                            <Typography>
                                {`${artistData.name}'s Top 3 Albums`}
                            </Typography>
                            <Carousel height="400px" animation="slide" navButtonsAlwaysVisible="true" sx={{margin: '10px'}}>
                                {
                                    artistData.topAlbums.map((album, index) => <Item key={index} item={album} />)
                                }
                            </Carousel>
                        </Box>
                    </Grid>
                </Grid>
            </div>
        );
    }
};
export default Artist;