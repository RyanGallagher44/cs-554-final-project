const express = require('express');
const router = express.Router();
const apikey = '36eb50dfc0c662f35dd0273529ed40eb';
const axios = require("axios");
const redis = require("redis");
const client = redis.createClient();
const { json } = require("express");
const albumArt = require('album-art');
client.connect().then(() => {})

// https://stackoverflow.com/questions/10599933/convert-long-number-into-abbreviated-string-in-javascript-with-a-special-shortn
function abbreviateNumber(value) {
    var newValue = value;
    if (value >= 1000) {
        var suffixes = ["", "K", "M", "B", "T"];
        var suffixNum = Math.floor( (""+value).length/3 );
        var shortValue = '';
        for (var precision = 2; precision >= 1; precision--) {
            shortValue = parseFloat( (suffixNum != 0 ? (value / Math.pow(1000,suffixNum) ) : value).toPrecision(precision));
            var dotLessShortValue = (shortValue + '').replace(/[^a-zA-Z 0-9]+/g,'');
            if (dotLessShortValue.length <= 2) { break; }
        }
        if (shortValue % 1 != 0)  shortValue = shortValue.toFixed(1);
        newValue = shortValue+suffixes[suffixNum];
    }
    return newValue;
}

async function getAlbums(artist, album){
    if(!artist) throw 'Error: required argument artist not supplied';
    if(!album) throw 'Error: required argument album not supplied';
    if(typeof(artist) != 'string' || typeof(album) != 'string') throw 'Error: artist or album invalid type';
    if(!artist.trim() || !album.trim()) throw 'Error: artist or album cannot be empty space';

    let { data } = await axios.get(`https://ws.audioscrobbler.com/2.0/?method=album.getInfo&api_key=${apikey}&artist=${artist}&album=${album}&format=json`);
    if(!data) throw 'Error 404: Not Found';
    return data
}

async function getArtists(artist) {
    if(!artist) throw 'Error: required arg artist not supplied';
    if(typeof(artist) != 'string') throw 'Error: required arg artist invalid type';
    if(!artist.trim()) throw 'Error: required art artist cannot be empty space';
    let { data } = await axios.get(`https://ws.audioscrobbler.com/2.0/?method=artist.getInfo&api_key=${apikey}&artist=${artist}&format=json`);
    return data;
}

async function getTracks(artist, track){
    if(!artist) throw 'Error: required arg artist not supplied';
    if(!track) throw 'Error: required arg track not supplied';
    if(typeof(artist) != 'string') throw 'Error: required arg artist invalid type.';
    if(typeof(track) != 'string') throw 'Error: required arg track invalid type';
    if(!artist.trim()) throw 'Error: required arg artist cannot be empty space';
    if(!track.trim()) throw 'Error: required arg track cannot be empty space';

    let { data } = await axios.get(`https://ws.audioscrobbler.com/2.0/?method=track.getInfo&api_key=${apikey}&artist=${artist}&track=${track}&format=json`);
    if(!data) throw 'Error 404: Not Found';
    return data
}

async function getTracksMBID(mbid){

}

async function searchAlbums(query, pagenum = 1){
    let { data } = await axios.get(`http://ws.audioscrobbler.com/2.0/?method=album.search&album=${query}&api_key=${apikey}&format=json&page=${pagenum}&limit=5`);
    let albums = [];
    if(data.results['opensearch:startIndex'] > 9950) {
        console.log("this is not allowed")
    } else {
        for (let i = 0; i < data.results.albummatches.album.length; i++) {
            let image = 'N/A';
            try {
                image = await albumArt(data.results.albummatches.album[i].artist, {album: data.results.albummatches.album[i].name});
            } catch (e) {
                console.log(e);
            }

            let albumObject = {
                name: data.results.albummatches.album[i].name,
                artist: data.results.albummatches.album[i].artist,
                mbid: data.results.albummatches.album[i].mbid,
                image: image
            };

            albums.push(albumObject);
        }
    }

    return albums;
}

async function searchArtists(query, pagenum = 1){
    let { data } = await axios.get(`http://ws.audioscrobbler.com/2.0/?method=artist.search&artist=${query}&api_key=${apikey}&format=json&page=${pagenum}&limit=5`);
    let artists = [];
    if(data.results['opensearch:startIndex'] > 9950) {
        console.log("this is not allowed")
    } else {
        for (let i = 0; i < data.results.artistmatches.artist.length; i++) {
            let image = 'N/A';
            try {
                image = await albumArt(data.results.artistmatches.artist[i].name);
            } catch (e) {
                console.log(e);
            }

            let artistObject = {
                name: data.results.artistmatches.artist[i].name,
                numListeners: abbreviateNumber(data.results.artistmatches.artist[i].listeners),
                mbid: data.results.artistmatches.artist[i].mbid,
                image: image
            };

            artists.push(artistObject);
        }
    }

    return artists;
}

async function getArtistByMBID(mbid) {
    const { data } = await axios.get(`https://ws.audioscrobbler.com/2.0/?method=artist.getInfo&api_key=${apikey}&mbid=${mbid}&format=json`);

    const data2 = await axios.get(`http://ws.audioscrobbler.com/2.0/?method=artist.gettopalbums&artist=${data.artist.name}&api_key=${apikey}&format=json&limit=3`);

    let albums = data2.data.topalbums.album;
    let topAlbums = [];
    for (let i = 0; i < albums.length; i++) {
        let albumImage = undefined;
        try {
            albumImage = await albumArt(data.artist.name, {album: albums[i].name});
        } catch (e) {

        }

        topAlbums.push({
            name: albums[i].name,
            mbid: albums[i].mbid,
            playCount: albums[i].playcount,
            image: albumImage
        });
    }

    const image = await albumArt(data.artist.name);

    let similarImages = [];
    let similarArtists = [];
    for (let i = 0; i < data.artist.similar.artist.length; i++) {
        let similarImage = undefined;
        try {
            similarImage = await albumArt(data.artist.similar.artist[i].name);
        } catch (e) {

        }

        similarImages.push(similarImage);
        similarArtists.push({name: data.artist.similar.artist[i].name, image: similarImages[i]});
    }

    let tags = [];
    data.artist.tags.tag.forEach((tag) => {
        tags.push(tag.name);
    });

    let artistObject = {
        name: data.artist.name,
        mbid: data.artist.mbid,
        numListeners: abbreviateNumber(data.artist.stats.listeners),
        playCount: abbreviateNumber(data.artist.stats.playcount),
        similarArtists: similarArtists,
        image: image,
        tags: tags,
        bio: data.artist.bio.summary,
        topAlbums: topAlbums
    };

    return artistObject;
}

async function getAlbumByMBID(mbid) {
    const { data } = await axios.get(`https://ws.audioscrobbler.com/2.0/?method=album.getInfo&api_key=${apikey}&mbid=${mbid}&format=json`);

    const image = await albumArt(data.album.artist, {album: data.album.name});

    let tags = [];
    data.album.tags.tag.forEach((tag) => {
        tags.push(tag.name);
    });

    let tracks = [];
    data.album.tracks.track.forEach((track) => {
        tracks.push({
            name: track.name,
            duration: `${(Math.floor(track.duration/60)).toString().padStart(2, '0')}:${(track.duration%60).toString().padStart(2, '0')}`,
            rank: track['@attr'].rank
        });
    });

    let albumObject = {
        name: data.album.name,
        mbid: mbid,
        numListeners: abbreviateNumber(data.album.listeners),
        playCount: abbreviateNumber(data.album.playcount),
        tracks: tracks,
        image: image,
        tags: tags,
        bio: data.album.wiki.summary
    };

    return albumObject;
}

async function searchTracks(query, pagenum = 1) {
    if(!query) throw 'Error: required arg query not supplied';
    if(typeof(query) != 'string') throw 'Error: required arg query invalid type';
    if(!query.trim()) throw 'Error: required arg query cannot be empty space';

    // if(isNaN(pagenum)) throw 'Error: pagenum must be a number';
    // pagenum = int(pagenum);
    // if(int(pagenum) < 1) pagenum = 1;

    let { data } = await axios.get(`http://ws.audioscrobbler.com/2.0/?method=track.search&track=${query}&api_key=${apikey}&format=json&page=${pagenum}&limit=50`);
    let results = [];
    if(data.results['opensearch:startIndex'] > 9950) {
        console.log("this is not allowed")
    } else {
        data.results.trackmatches.track.forEach((track) => {
            results.push(`${track.name} - ${track.artist}`);
        });
    }

    return results.splice(0, 5);
}

async function getTopArtists() {
    const { data } = await axios.get(`https://ws.audioscrobbler.com/2.0/?method=chart.gettopartists&api_key=${apikey}&format=json&limit=10`)

    let topArtists = [];
    for (let i = 0; i < data.artists.artist.length; i++) {
        let image = undefined;
        try {
            image = await albumArt(data.artists.artist[i].name);
        } catch (e) {

        }

        topArtists.push({
            name: data.artists.artist[i].name,
            mbid: data.artists.artist[i].mbid,
            numListeners: abbreviateNumber(data.artists.artist[i].listeners),
            playCount: abbreviateNumber(data.artists.artist[i].playcount),
            image: image
        });
    }

    return topArtists;
}

async function getTopTracks() {
    const { data } = await axios.get(`https://ws.audioscrobbler.com/2.0/?method=chart.gettoptracks&api_key=${apikey}&format=json&limit=10`)

    let topTracks = [];
    for (let i = 0; i < data.tracks.track.length; i++) {
        let image = undefined;
        try {
            image = await albumArt(data.tracks.track[i].artist.name);
        } catch (e) {

        }

        topTracks.push({
            name: data.tracks.track[i].name,
            mbid: data.tracks.track[i].mbid,
            numListeners: abbreviateNumber(data.tracks.track[i].listeners),
            playCount: abbreviateNumber(data.tracks.track[i].playcount),
            artist: data.tracks.track[i].artist.name,
            image: image
        });
    }

    return topTracks;
}

router.get('/topartists', async (req, res) => {
    try {
        const results = await getTopArtists();

        res.json(results);
    } catch (e) {
        res.status(404).json({error: e});
    }
});

router.get('/toptracks', async (req, res) => {
    try {
        const results = await getTopTracks();

        res.json(results);
    } catch (e) {
        res.status(404).json({error: e});
    }
});

router.get('/tracks/search/:term', async (req, res) => {
    try {
        if(!req.params.term) res.status(400).json({error: 'Required arg term not supplied'});
        if(typeof(req.params.term) != 'string') res.status(400).json({error: 'Required arg term invalid type'});
        if(!req.params.term.trim()) res.status(400).json({error: 'Required arg term cannot be empty space'});

        const results = await searchTracks(req.params.term, 1);
        res.json(results);
    } catch (e) {
        //console.log(req.params.term, e.toString())
        res.status(404).json({error: e});
    }
});

router.get('/artists/search/:term', async (req, res) => {
    try {
        const results = await searchArtists(req.params.term, 1);
        res.json(results);
    } catch (e) {
        res.status(404).json({error: e});
    }
});

router.get('/albums/search/:term', async (req, res) => {
    try {
        const results = await searchAlbums(req.params.term, 1);
        res.json(results);
    } catch (e) {
        res.status(404).json({error: e});
    }
});

router.get('/artists/:id', async (req, res) => {
    try {
        if(!req.params.id) res.status(400).json({error: 'Required arg id not supplied'});
        if(typeof(req.params.id) != 'string') res.status(400).json({error: 'Required arg id invalid type'});
        if(!req.params.id.trim()) res.status(400).json({error: 'Required arg id cannot be empty space'});
        const results = await getArtistByMBID(req.params.id);

        res.json(results);
    } catch (e) {
        res.status(404).json({error: e});
    }
});

router.get('/albums/:id', async (req, res) => {
    try {
        if(!req.params.id) res.status(400).json({error: 'Required arg id not supplied'});
        if(typeof(req.params.id) != 'string') res.status(400).json({error: 'Required arg id invalid type'});
        if(!req.params.id.trim()) res.status(400).json({error: 'Required arg id cannot be empty space'});
        const results = await getAlbumByMBID(req.params.id);

        res.json(results);
    } catch (e) {
        res.status(404).json({error: e});
    }
});

router.get('/tracks/:artistName/:trackName', async (req, res) => {
    try{
        if(!req.params.artistName) res.status(400).json({error: 'Required arg artistName not supplied'});
        if(!req.params.trackName) res.status(400).json({error: 'Required arg trackName not supplied'});
        if(typeof(req.params.artistName) != 'string') res.status(400).json({error: 'Required arg artistName invalid type'});
        if(typeof(req.params.trackName) != 'string') res.status(400).json({error: 'Required arg trackName invalid type'});
        if(!req.params.artistName.trim()) res.status(400).json({error: 'Required arg artist name cannot be empty space'});
        if(!req.params.trackName.trim()) res.status(400).json({error: 'Required arg trackName cannot be empty space'});

        const results = await getTracks(req.params.artistName, trackName);
        res.json(results);
    } catch(e){
        res.status(404).json({error: e});
    }
});

router.get('/album/:artistName/:albumName', async (req, res) => {
    if(!req.params.artistName) res.status(400).json({error: 'Required arg artistName not supplied'});
    if(!req.params.albumName) res.status(400).json({error: 'Required arg albumName not supplied'});
    if(typeof(req.params.artistName) != 'string') res.status(400).json({error: 'Required arg artistName invalid type'});
    if(typeof(req.params.albumName) != 'string') res.status(400).json({error: 'Required arg albumName invalid type'});
    if(!req.params.artistName.trim()) res.status(400).json({error: 'Required arg artist name cannot be empty space'});
    if(!req.params.albumName.trim()) res.status(400).json({error: 'Required arg albumName cannot be empty space'});

    let page = `album_${req.params.artistName}_${req.params.albumName}`
    try {
        let cacheForAlbumExists = await client.get(page);
        if (cacheForAlbumExists) {
            console.log('Data was in cache');
            res.send(JSON.parse(cacheForAlbumExists));
        } else {
            let x = await getAlbums(req.params.artistName, req.params.albumName);
            if(x.data.results.length == 0){
                res.status(404).json({error: 'Album not found'});
                return;
            }
            console.log('Data was not in cache');
            await client.set(
                page,
                JSON.stringify(x.data)
            )
            res.send(x.data)
        }
    } catch (error) {
        res.status(404).json({error: error})
    }
});

router.get('/artist/:name', async (req, res) => {
    let page = `artist_${req.params.name}`

    try{
        let cacheForArtistExists = await client.get(page);
        if(cacheForArtistExists){
            console.log(`Artist with cache key ${page} found.`);
            res.send(JSON.parse(cacheForArtistExists));
        } else{
            let x = await getArtists(req.params.name);
            if(x.data.results.length === 0){
                res.status(404).json({error: 'Artist not found'})
                return;
            }
            console.log(`Not found in cache`);
            await client.set(page, JSON.stringify(x.data));
            res.send(x.data);
        }
    } catch(e){
        res.status(404).json({error: e});
    }
})

module.exports = router;