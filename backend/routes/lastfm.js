const express = require('express');
const router = express.Router();
const apikey = '36eb50dfc0c662f35dd0273529ed40eb';
const axios = require("axios");
const redis = require("redis");
const client = redis.createClient();
const { json } = require("express");
client.connect().then(() => {})
async function getAlbums(artist, album){
    let { data } = await axios.get(`https://ws.audioscrobbler.com/2.0/?method=album.getInfo&api_key=${apikey}&artist=${artist}&album=${album}&format=json`);
    return data
}

async function getArtists(artist){
    let { data } = await axios.get(`https://ws.audioscrobbler.com/2.0/?method=artist.getInfo&api_key=${apikey}&artist=${artist}&format=json`);
    return data
}

async function getTracks(artist, track){
    let { data } = await axios.get(`https://ws.audioscrobbler.com/2.0/?method=track.getInfo&api_key=${apikey}&artist=${artist}&track=${track}&format=json`);
    return data
}

async function searchAlbums(query, pagenum){
    let { data } = await axios.get(`http://ws.audioscrobbler.com/2.0/?method=album.search&album=${query}&api_key=${apikey}&format=json&page=${pagenum}&limit=50`);
    if(data.results['opensearch:startIndex'] > 9950) {
        console.log("this is not allowed")
    } else {
        console.log(data.results.albummatches)
    }
}

async function searchArtists(query, pagenum){
    let { data } = await axios.get(`http://ws.audioscrobbler.com/2.0/?method=artist.search&artist=${query}&api_key=${apikey}&format=json&page=${pagenum}&limit=50`);
    if(data.results['opensearch:startIndex'] > 9950) {
        console.log("this is not allowed")
    } else {
        console.log(data.results.artistmatches)
    }
}

async function searchTracks(query, pagenum) {
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
        const results = await searchTracks(req.params.term, 1);
        res.json(results);
    } catch (e) {
        res.status(404).json({error: e});
    }
});

router.get('/album/:albumName', async (req, res) => {
    let page = `album_${req.params.albumName}`
    try {
        let cacheForAlbumExists = await client.get(page);
        if (cacheForAlbumExists) {
            console.log('Data was in cache');
            res.send(JSON.parse(cacheForAlbumExists));
        } else {
            let x = await getAlbums(req.params.albumName);
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