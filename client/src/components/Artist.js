import React, {useState, useEffect} from 'react';
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
    Stack
} from '@mui/material';
import { Box } from '@mui/system';
import parse from 'html-react-parser';

const Artist = () => {
    const [artistData, setArtistData] = useState(undefined);
    const [loading, setLoading] = useState(true);
    const {id} = useParams();

    useEffect(() => {
        async function fetchData() {
            try {
                const { data } = await axios.get(`http://localhost:3030/lastfm/artists/${id}`);
                setArtistData(data);
                setLoading(false);
            } catch (e) {
                setLoading(false);
            }
        }

        if (id) {
            fetchData();
        }
    }, [id]);

    if (loading) {
        return(
            <div>
                <h2>Loading...</h2>
            </div>
        );
    } else {
        return(
            <div className='artist'>
                <Box
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                >
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
                        <List sx={{maxWidth: 360, bgcolor: 'background.paper'}}>
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
                    </Stack>
                    <Typography
                        sx={{
                            padding: '100px'
                        }}
                    >
                        {parse(artistData.bio)}
                    </Typography>
                </Box>
            </div>
        );
    }
};
export default Artist;