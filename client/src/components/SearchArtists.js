import { TextField } from '@mui/material';
import React, { useRef } from 'react';

const SearchArtists = (props) => {
    const searchTermRef = useRef();

    const handleChange = () => {
        props.searchValue(searchTermRef.current.value);
    };

    return(
        <TextField
            label="Search artists"
            onChange={handleChange}
            inputRef={searchTermRef}
        />
    );
};

export default SearchArtists;