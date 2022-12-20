import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
    List,
    ListItem,
    ListItemAvatar,
    Avatar,
    ListItemText,
    Divider,
    Stack,
    Grid,
    Card,
    CardActionArea,
    CardMedia,
    CardContent,
    Typography
} from '@mui/material';
import { Link } from 'react-router-dom';
import { Box } from '@mui/system';
import Headphones from '@mui/icons-material/Headphones';
import SearchArtists from './SearchArtists';
import SearchAlbums from './SearchAlbums';
import noImage from '../images/noImage.png';

const Discover = () => {
    const [topArtistsData, setTopArtistsData] = useState(undefined);
    const [topTracksData, setTopTracksData] = useState(undefined);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchData() {
            try {
                const { data } = await axios.get('http://localhost:3030/lastfm/topartists');
                setTopArtistsData(data);
            } catch (e) {
                setLoading(false);
            }

            try {
                const { data } = await axios.get('http://localhost:3030/lastfm/toptracks');
                setTopTracksData(data);
                setLoading(false);
            } catch (e) {
                setLoading(false);
            }
        }

        fetchData();
    }, []);

    // indicates the state when searching for an artist
    const [searchArtistsData, setSearchArtistsData] = useState(undefined);
    const [searchArtistTerm, setSearchArtistTerm] = useState("");

    // indicates the state when searching for an album
    const [searchAlbumsData, setSearchAlbumsData] = useState(undefined);
    const [searchAlbumTerm, setSearchAlbumTerm] = useState("");

    // triggered when user begins to search for an artist
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

    // triggers when user begins to search for an album
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

    // builds an artist card when searching for an artist
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

    // builds an album card when searching for an album
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
        return(
            <div className="discover">
                <h2>Discover</h2>
                {!searchAlbumTerm &&
                    <SearchArtists searchValue={searchArtistValue} />
                }
                {!searchArtistTerm &&
                    <SearchAlbums searchValue={searchAlbumValue} />
                }
                {!searchArtistTerm && !searchAlbumTerm &&
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
                            <h2>Top 10 Artists</h2>
                            <List sx={{width: '300px', bgcolor: 'background.paper', color: 'black', borderRadius: '10px'}}>
                                {topArtistsData.map((artist) => {
                                    return(
                                        <div>
                                            {artist.mbid &&
                                                <Link to={`/artist/${artist.mbid}`}>
                                                    <ListItem
                                                        secondaryAction={
                                                            <Box
                                                                display="flex"
                                                                alignItems="center"
                                                            >
                                                                <ListItemText
                                                                    primary={artist.playCount}
                                                                />
                                                                <Headphones 
                                                                    sx={{
                                                                        paddingLeft: '5px'
                                                                    }}
                                                                />
                                                            </Box>
                                                        }
                                                    >
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
                                                <ListItem
                                                    secondaryAction={
                                                        <Box
                                                            display="flex"
                                                            alignItems="center"
                                                        >
                                                            <ListItemText
                                                                primary={artist.playCount}
                                                            />
                                                            <Headphones 
                                                                sx={{
                                                                    paddingLeft: '5px'
                                                                }}
                                                            />
                                                        </Box>
                                                    }
                                                >
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
                        </Stack>

                        <Stack
                            sx={{
                                margin: '50px',
                                alignItems: 'center'
                            }}
                        >
                            <h2>Top 10 Tracks</h2>
                            <List sx={{width: '300px', bgcolor: 'background.paper', color: 'black', borderRadius: '10px'}}>
                                {topTracksData.map((track) => {
                                    return(
                                        <div>
                                            {track.mbid &&
                                                <Link to={`/track/${track.mbid}`}>
                                                    <ListItem
                                                        secondaryAction={
                                                            <Box
                                                                display="flex"
                                                                alignItems="center"
                                                            >
                                                                <ListItemText
                                                                    primary={track.playCount}
                                                                />
                                                                <Headphones 
                                                                    sx={{
                                                                        paddingLeft: '5px'
                                                                    }}
                                                                />
                                                            </Box>
                                                        }
                                                    >
                                                        <ListItemAvatar>
                                                            <Avatar alt={`${track.name}`} src={`${track.image}`} />
                                                        </ListItemAvatar>
                                                        <ListItemText
                                                            primary={track.name}
                                                        />
                                                    </ListItem>
                                                </Link>
                                            }
                                            {!track.mbid &&
                                                <ListItem
                                                    secondaryAction={
                                                        <Box
                                                            display="flex"
                                                            alignItems="center"
                                                        >
                                                            <ListItemText
                                                                primary={track.playCount}
                                                            />
                                                            <Headphones 
                                                                sx={{
                                                                    paddingLeft: '5px'
                                                                }}
                                                            />
                                                        </Box>
                                                    }
                                                >
                                                    <ListItemAvatar>
                                                        <Avatar alt={`${track.name}`} src={`${track.image}`} />
                                                    </ListItemAvatar>
                                                    <ListItemText
                                                        primary={track.name}
                                                    />
                                                </ListItem>
                                            }
                                            <Divider variant="inset" component="li" />
                                        </div>
                                    )})
                                }
                            </List>
                        </Stack>
                    </Box>
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
                }
            </div>
        );
    }
};

export default Discover; 