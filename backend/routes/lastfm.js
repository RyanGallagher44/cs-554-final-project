const express = require('express');
const router = express.Router();
const apikey = '36eb50dfc0c662f35dd0273529ed40eb'
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

async function searchTracks(query, pagenum){
    let { data } = await axios.get(`http://ws.audioscrobbler.com/2.0/?method=track.search&track=${query}&api_key=${apikey}&format=json&page=${pagenum}&limit=50`);
    if(data.results['opensearch:startIndex'] > 9950) {
        console.log("this is not allowed")
    } else {
        console.log(data.results.trackmatches)
    }
}

router.get('/:album', async (req, res) => {
    let page = `album_${req.params}`
    try {
        let cacheForAlbumExists = await client.get(page)
        if (cacheForAlbumExists) {
            console.log('Data was in cache')
            res.send(JSON.parse(cacheForAlbumExists))
        } else {
            let x = await getAlbums(req.params.pagenum)
            if(x.data.results.length == 0){
                throw ''
            }
            console.log('Data was not in cache')
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
module.exports = router;