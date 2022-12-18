const express = require('express');
const axios = require('axios');
const { v4: uuidv4 } = require('uuid');
const https = require('https');
const router = express.Router();
const elasticInfo = require('./config');
const apikey = '36eb50dfc0c662f35dd0273529ed40eb';

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

router.post('/upload', async (req,res) => {
        const params = req.body;
        //TODO: input verification!!!! 
        const [posterId, posterUsername, timePosted, body, songName, artistName] = [params.posterId, params.posterUsername, params.timePosted, params.body, params.songName, params.artistName];
        const songData = (await axios.get(`https://ws.audioscrobbler.com/2.0/?method=track.search&track=${songName}&api_key=${apikey}&format=json&page=1&limit=1`)).data.results.trackmatches.track[0];
        const data = {
            posterId: posterId,
            posterUsername: posterUsername,
            timePosted: timePosted,
            body: body,
            songId: songData.mbid,
            songName: songName, 
            artistName: artistName,
            songUrl: songData.url,
            likes: [],
            replies: []
        };
        const id = uuidv4();
        try{
            let postData = await instance.post(elasticUrl+'/posts/_doc/'+id+'?refresh=true', data);
            //console.log(postData.data);
            return res.status(200).json({postId: id});
        }
        catch(e){
            return res.status(400).json({error: e.toString()});
        }
    }
)
.delete('/delete/:id', async (req, res) => {
        //TODO add input checking! CHECK THE USER IS THE OP!!!!! *****VERY IMPORTANT******
        const id = req.params.id;
        try{
            let postData = await instance.delete(elasticUrl+'/posts/_doc/'+id+'?refresh=true');
            //console.log(postData);
            return res.status(200).json({result: postData.data.result, postId: id});
        }
        catch(e){
            return res.status(400).json({error: e.toString()});
        }
    }
)
.get('/search', async (req, res) => {
        //TODO: input checking
        
})
.get('/all', async (req, res) => {
    try {
        const allSongs = await instance.get(elasticUrl+'/posts/_search?pretty=true&q=*:*');
        let hits = allSongs.data.hits.hits;
        let sortedHits = hits.sort((a, b) => new Date(b._source.timePosted).getTime() - new Date(a._source.timePosted).getTime());
        return res.json(sortedHits);
    } catch (e) {
        console.log(e);
    }
})
.get('/:id', async (req, res) => {
    //TODO: input checking
    const id = req.params.id;
    try{
        let postData = await instance.get(elasticUrl+'/posts/_source/'+id);
        let post = postData.data;
        post.id = id;
        return res.status(200).json(post);
    }
    catch(e){
        return res.status(400).json({error: 'Could not retrieve post.'})
    }
})
.post('/reply', async (req, res) => {
    const params = req.body;
    
    const [userId, postId, reply, timePosted, posterName] = [params.userId, params.postId, params.reply, params.timePosted, params.posterName];
    try{
        let postData = await instance.get(elasticUrl+'/posts/_source/'+postId+'?refresh=true');
        let post = postData.data;
        const id = uuidv4();
        let currentReplies = post.replies;
        currentReplies.push(
            {
                replyId: id,
                posterId: userId,
                posterName: posterName,
                reply: reply,
                timePosted: timePosted
            }
        );
        post.replies = currentReplies;
        await instance.put(elasticUrl+'/posts/_doc/'+postId+'?refresh=true', post);
        return res.status(200).json({message: 'success'});
    }
    catch(e){
        console.log(e);
        return res.status(400).json({error: e})
    }
})
.post('/unreply', async (req, res) => {
    const params = req.body;
    
    const [replyId, postId] = [params.replyId, params.postId];
    try{
        let postData = await instance.get(elasticUrl+'/posts/_source/'+postId+'?refresh=true');
        let post = postData.data;
        let currentReplies = post.replies;
        let replyIndex = currentReplies.map(function(e) { return e.replyId; }).indexOf(replyId);
        currentReplies.splice(replyIndex, 1);
        post.replies = currentReplies;
        await instance.put(elasticUrl+'/posts/_doc/'+postId+'?refresh=true', post);
        return res.status(200).json({message: 'success'});
    }
    catch(e){
        console.log(e);
        return res.status(400).json({error: e})
    }
});;

module.exports = router;