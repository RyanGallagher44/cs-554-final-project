import { TextField } from '@mui/material';
import React, { useRef } from 'react';

const SearchArtists = (props) => {
    const searchTermRef = useRef();

    const handleChange = () => {
        props.searchValue(searchTermRef.current.value);
    };

    return(
        <TextField
            sx={{
                input: {
                    color: 'black',
                    backgroundColor: 'white',
                    borderRadius: '5px'
                },
                margin: '5px'
            }}
            label="Find an artist"
            onChange={handleChange}
            inputRef={searchTermRef}
            variant='filled'
        />
    );
};

export default SearchArtists;