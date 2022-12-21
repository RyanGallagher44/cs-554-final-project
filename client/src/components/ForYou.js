import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../firebase/Auth';
import axios from 'axios';
import { Link } from 'react-router-dom';
import {
    List,
    ListItem,
    Stack,
    ListItemText,
    ListItemAvatar,
    Avatar,
    Divider
} from '@mui/material';

const ForYou = () => {
    const [loading, setLoading] = useState(true);
    const [forYouData, setForYouData] = useState(undefined);
    const {currentUser} = useContext(AuthContext);

    useEffect(() => {
        async function fetchData() {
            try {
                const { data } = await axios.get(`http://localhost:3030/users/foryou/${currentUser.uid}`);
                setForYouData(data);
                console.log(data);
                setLoading(false);
            } catch (e) {
                setLoading(false);
            }
        }

        fetchData();
    }, [])

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
            <div className='for-you'>
                <Stack
                    sx={{
                        alignItems: 'center'
                    }}
                >
                    <h2>Recommended Artists</h2>
                    <List sx={{width: '300px', bgcolor: 'background.paper', color: 'black', borderRadius: '10px'}}>
                        {forYouData.map((artist) => {
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
                </Stack>
            </div>
        );
    }
};

export default ForYou;