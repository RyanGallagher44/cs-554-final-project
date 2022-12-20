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

async function getAlbumsMBID(mbid){
    if(!mbid) throw 'Error: required arg MBID not supplied';
    if(typeof(mbid) != 'string') throw 'Error: required arg mbid invalid type';
    if(!mbid.trim()) throw 'Error: required arg mbid cannot be empty space';

    let { data } = await axios.get(`https://ws.audioscrobbler.com/2.0/?method=album.getInfo&api_key=${apikey}&mbid=${mbid}&format=json`);
    if(!data) throw 'Error 404: Not Found';
    return data;
}

async function getArtists(artist) {
    if(!artist) throw 'Error: required arg artist not supplied';
    if(typeof(artist) != 'string') throw 'Error: required arg artist invalid type';
    if(!artist.trim()) throw 'Error: required art artist cannot be empty space';
    let { data } = await axios.get(`https://ws.audioscrobbler.com/2.0/?method=artist.getInfo&api_key=${apikey}&artist=${artist}&format=json`);
    return data;
}

async function getArtistsMBID(mbid){

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

async function searchAlbums(query, pagenum){
    let { data } = await axios.get(`http://ws.audioscrobbler.com/2.0/?method=album.search&album=${query}&api_key=${apikey}&format=json&page=${pagenum}&limit=50`);
    if(data.results['opensearch:startIndex'] > 9950) {
        console.log("this is not allowed")
    } else {
        console.log(data.results.albummatches)
    }
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
                numListeners: data.results.artistmatches.artist[i].listeners,
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

    const image = await albumArt(data.artist.name);

    let similarImages = [];
    let similarArtists = [];
    for (let i = 0; i < data.artist.similar.artist.length; i++) {
        similarImages.push(await albumArt(data.artist.similar.artist[i].name));
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
        bio: data.artist.bio.summary
    };

    return artistObject;
}

async function searchTracks(query, pagenum = 1) {
    if(!query) throw 'Error: required arg query not supplied';
    if(typeof(query) != 'string') throw 'Error: required arg query invalid type';
    if(!query.trim()) throw 'Error: required arg query cannot be empty space';

    if(isNaN(pagenum)) throw 'Error: pagenum must be a number';
    pagenum = parseInt(pagenum);
    if(parseInt(pagenum) < 1) pagenum = 1;


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

router.get('/artists/:id', async (req, res) => {
    try {
        const results = await getArtistByMBID(req.params.id);

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