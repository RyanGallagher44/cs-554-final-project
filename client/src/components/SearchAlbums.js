import { TextField } from '@mui/material';
import React, { useRef } from 'react';

const SearchAlbums = (props) => {
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
            label="Find an album"
            onChange={handleChange}
            inputRef={searchTermRef}
            variant='filled'
        />
    );
};

export default SearchAlbums;