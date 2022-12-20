const express = require('express');
const multer = require('multer');
const axios = require('axios');
const { v4: uuidv4 } = require('uuid');
const https = require('https');
const path = require('path');
const fs = require('fs/promises');
const router = express.Router();
const elasticInfo = require('./config');
const albumArt = require('album-art');
const { fstat } = require('fs');
const apikey = '36eb50dfc0c662f35dd0273529ed40eb';

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads')
    },
    filename: function (req, file, cb) {
        const uniquePrefix = Date.now() + '-' + Math.round(Math.random() * 1E9)
        cb(null, uniquePrefix + '-' + file.originalname)
    }
})

const upload = multer({ storage: storage,
fileFilter: function(req, file, cb){
    let ext = path.extname(file.originalname);
    if(!['.png', '.jpg', '.jpeg', '.gif'].includes(ext)){
        return cb(new Error('Only images are allowed'));
    }
    cb(null, true)
}
});

//EDIT URL, USERNAME, AND PASSWORD FOR THE ELASTIC INSTALL ON YOUR SYSTEM IN './elasticinfo.js'
const [elasticUrl, serverUrl] = [elasticInfo.elasticUrl, elasticInfo.serverUrl];
const instance = axios.create({
    httpsAgent: new https.Agent({  
        rejectUnauthorized: false
    }),
    auth: {
        username: elasticInfo.username,
        password: elasticInfo.password
    }
});

async function getArtistByMBID(mbid) {
    const { data } = await axios.get(`https://ws.audioscrobbler.com/2.0/?method=artist.getInfo&api_key=${apikey}&mbid=${mbid}&format=json`);

    let image = undefined;
    try {
        image = await albumArt(data.artist.name);
    } catch (e) {

    }

    let artistObject = {
        name: data.artist.name,
        mbid: data.artist.mbid,
        image: image
    };

    return artistObject;
}

async function getAlbumByMBID(mbid) {
    const { data } = await axios.get(`https://ws.audioscrobbler.com/2.0/?method=album.getInfo&api_key=${apikey}&mbid=${mbid}&format=json`);

    let image = undefined;
    try {
        image = await albumArt(data.album.artist, {album: data.album.name});
    } catch (e) {

    }

    let albumObject = {
        name: data.album.name,
        mbid: mbid,
        image: image
    };

    return albumObject;
}

router.post('/create', upload.single('avatar'), async (req,res) => {
    const params = req.body;
    //TODO: User verification
    //Done
    if(!params.fullName || !params.username || !params.uid){
        return res.status(400).json({error: "You need a full name, username, and user id"});
    }
    if(typeof params.fullName != 'string' || typeof params.username != 'string' || typeof params.uid != 'string'){
        return res.status(400).json({error: "Full name, username, and user id need to be strings"});
    }
    if(!params.fullName.trim() || !params.username.trim() || !params.uid.trim()){
        return res.status(400).json({error: "You need non-empty full name, username, and user id"});
    }
    //uid is the firebase user's uid
    let filename
    if(typeof req.file !== 'undefined'){
        filename = req.file.filename;
    }else{
        filename = 'default.png';
    }
    
    const [fullName, username, uid] = [params.fullName, params.username, params.uid];
        const data = {
            fullName: fullName,
            username: username,
            profilePicture: serverUrl+'/users/img/'+ filename,
            profilePictureName: filename,
            likedSongs: [],
            likedArtists: [],
            likedAlbums: [],
            likedPosts: []
        };
        const id = uuidv4();
        try{
            let userData = await instance.post(elasticUrl+'/users/_doc/'+uid, data)
            //console.log(userData.data);
            return res.status(200).json({userId: id});
        }
        catch(e){
            return res.status(400).json({error: e.toString()});
        }
    }
)
.post('/login', async (req, res) => {
    if (req.body.user.providerData.length > 0) {
        try{
            await instance.get(elasticUrl+'/users/_source/'+uid, data)
        }
        catch(e){
            const data = {
                fullName: req.body.user.displayName,
                username: req.body.user.email,
                profilePicture: req.body.user.photoURL,
                profilePictureName: req.body.user.photoURL,
                likedSongs: [],
                likedArtists: [],
                likedAlbums: [],
                likedPosts: []
            };
            const id = uuidv4();
            try{
                await instance.post(elasticUrl+'/users/_doc/'+req.body.uid, data)
            }
            catch(e){
                console.log(e);
            }
        }
    }

    req.session.uid = req.body.uid;

    return res.sendStatus(200);
})
.get('/logout', async (req, res) => {
    req.session.destroy();
    console.log('logged out!');

    return res.sendStatus(200);
})
.get('/img/default', async(req,res)=>{
    //TODO: verify inputs and error handling
    const imgpath = '../uploads/default.png';
    return res.sendFile(path.join(__dirname, imgpath));
})
.get('/img/:filename', async(req,res)=>{
        //TODO: verify inputs & error checking
        //Done
        if(!req.params.filename){
            return res.status(400).json({error: "Filename must be an input"});
        }
        if(typeof req.params.filename != 'string'){
            return res.status(400).json({error: "Filename must be a string"});
        }
        if(!req.params.filename.trim()){
            return res.status(400).json({error: "Filename must be non-empty"});
        }
        const filename = req.params.filename;

        const imgpath = '../uploads/'+filename;
        
        return res.sendFile(path.join(__dirname, imgpath));
})
.delete('/delete/:id', async (req, res) => {
        const id = req.params.id;
        try{
            let userData = await instance.get(elasticUrl+'/users/_source/'+id);
            let user = userData.data;
            const imgName = user.profilePictureName;
            if(imgName !== 'default.png'){
                await fs.unlink(path.join(__dirname, '../uploads/' + imgName));
            }
            userData = await instance.delete(elasticUrl+'/users/_doc/'+id);
            //console.log(postData);
            return res.status(200).json({result: userData.data.result, userId: id});
        }
        catch(e){
            return res.status(400).json({error: e.toString()});
        }
    }
)
.get('/:id', async (req, res) => {
    //TODO: input checking
    //Done
    if(!req.params.id){
        return res.status(400).json({error: "ID must be an input"});
    }
    if(typeof req.params.id != 'string'){
        return res.status(400).json({error: "ID must be a string"});
    }
    if(!req.params.id.trim()){
        return res.status(400).json({error: "ID must be non-empty"});
    }
    const id = req.params.id;
    try{
        let userData = await instance.get(elasticUrl+'/users/_source/'+id);
        let user = userData.data;
        user.id = id;
        return res.status(200).json(user);
    }
    catch(e){
        return res.status(400).json({error: 'Could not retrieve user.'})
    }
})
.get('/expanded/:id', async (req, res) => {
    //TODO: input checking
    const id = req.params.id;
    try{
        let userData = await instance.get(elasticUrl+'/users/_source/'+id);
        let likedArtistsExpanded = [];
        for (let i = 0; i < userData.data.likedArtists.length; i++) {
            likedArtistsExpanded.push(await getArtistByMBID(userData.data.likedArtists[i]));
        }
        let likedAlbumsExpanded = [];
        for (let i = 0; i < userData.data.likedAlbums.length; i++) {
            likedAlbumsExpanded.push(await getAlbumByMBID(userData.data.likedAlbums[i]));
        }

        userData.data.likedArtistsExpanded = likedArtistsExpanded;
        userData.data.likedAlbumsExpanded = likedAlbumsExpanded;
        userData.data.uid = id;

        user = userData.data;

        return res.status(200).json(user);
    }
    catch(e){
        return res.status(400).json({error: 'Could not retrieve user.'})
    }
})
.post('/like', async (req, res) => {
    const params = req.body;
    
    const [userId, postId] = [params.userId, params.postId];
    try{
        let userData = await instance.get(elasticUrl+'/users/_source/'+userId+'?refresh=true');
        let user = userData.data;
        let currentLikedPosts = user.likedPosts;
        currentLikedPosts.push(postId);
        user.likedPosts = currentLikedPosts;
        await instance.put(elasticUrl+'/users/_doc/'+userId+'?refresh=true', user);

        let postData = await instance.get(elasticUrl+'/posts/_source/'+postId+'?refresh=true');
        let post = postData.data;
        let currentLikes = post.likes;
        currentLikes.push(userId);
        post.likes = currentLikes;
        await instance.put(elasticUrl+'/posts/_doc/'+postId+'?refresh=true', post);
        return res.status(200).json({message: 'success'});
    }
    catch(e){
        console.log(e);
        return res.status(400).json({error: e})
    }
})
.post('/unlike', async (req, res) => {
    const params = req.body;
    
    const [userId, postId] = [params.userId, params.postId];
    try{
        let userData = await instance.get(elasticUrl+'/users/_source/'+userId+'?refresh=true');
        let user = userData.data;
        let currentLikedPosts = user.likedPosts;
        let postIndex = currentLikedPosts.indexOf(postId);
        currentLikedPosts.splice(postIndex, 1);
        user.likedPosts = currentLikedPosts;
        await instance.put(elasticUrl+'/users/_doc/'+userId+'?refresh=true', user);

        let postData = await instance.get(elasticUrl+'/posts/_source/'+postId+'?refresh=true');
        let post = postData.data;
        let currentLikes = post.likes;
        let userIndex = currentLikes.indexOf(userId);
        currentLikes.splice(userIndex, 1);
        post.likes = currentLikes;
        await instance.put(elasticUrl+'/posts/_doc/'+postId+'?refresh=true', post);
        return res.status(200).json({message: 'success'});
    }
    catch(e){
        console.log(e);
        return res.status(400).json({error: e})
    }
})
.post('/likeArtist', async (req, res) => {
    const params = req.body;
    
    const [userId, mbid] = [params.userId, params.mbid];
    try{
        let userData = await instance.get(elasticUrl+'/users/_source/'+userId+'?refresh=true');
        let user = userData.data;
        let currentLikedArtists = user.likedArtists;
        currentLikedArtists.push(mbid);
        user.likedArtists = currentLikedArtists;
        await instance.put(elasticUrl+'/users/_doc/'+userId+'?refresh=true', user);

        return res.status(200).json({message: 'success'});
    }
    catch(e){
        console.log(e);
        return res.status(400).json({error: e})
    }
})
.post('/unlikeArtist', async (req, res) => {
    const params = req.body;
    
    const [userId, mbid] = [params.userId, params.mbid];
    try{
        let userData = await instance.get(elasticUrl+'/users/_source/'+userId+'?refresh=true');
        let user = userData.data;
        let currentLikedArtists = user.likedArtists;
        let artistIndex = currentLikedArtists.indexOf(mbid);
        currentLikedArtists.splice(artistIndex, 1);
        user.likedArtists = currentLikedArtists;
        await instance.put(elasticUrl+'/users/_doc/'+userId+'?refresh=true', user);

        return res.status(200).json({message: 'success'});
    }
    catch(e){
        console.log(e);
        return res.status(400).json({error: e})
    }
})
.post('/likeAlbum', async (req, res) => {
    const params = req.body;
    
    const [userId, mbid] = [params.userId, params.mbid];
    try{
        let userData = await instance.get(elasticUrl+'/users/_source/'+userId+'?refresh=true');
        let user = userData.data;
        let currentLikedAlbums = user.likedAlbums;
        currentLikedAlbums.push(mbid);
        user.likedAlbums = currentLikedAlbums;
        await instance.put(elasticUrl+'/users/_doc/'+userId+'?refresh=true', user);

        return res.status(200).json({message: 'success'});
    }
    catch(e){
        console.log(e);
        return res.status(400).json({error: e})
    }
})
.post('/unlikeAlbum', async (req, res) => {
    const params = req.body;
    
    const [userId, mbid] = [params.userId, params.mbid];
    try{
        let userData = await instance.get(elasticUrl+'/users/_source/'+userId+'?refresh=true');
        let user = userData.data;
        let currentLikedAlbums = user.likedAlbums;
        let artistIndex = currentLikedAlbums.indexOf(mbid);
        currentLikedAlbums.splice(artistIndex, 1);
        user.likedAlbums = currentLikedAlbums;
        await instance.put(elasticUrl+'/users/_doc/'+userId+'?refresh=true', user);

        return res.status(200).json({message: 'success'});
    }
    catch(e){
        console.log(e);
        return res.status(400).json({error: e})
    }
});

module.exports = router;