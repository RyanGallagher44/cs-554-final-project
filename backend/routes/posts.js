const express = require('express');
const axios = require('axios');
const { v4: uuidv4 } = require('uuid');
const https = require('https');
const router = express.Router();
const elasticInfo = require('./config');
const apikey = '36eb50dfc0c662f35dd0273529ed40eb';

//EDIT URL, USERNAME, AND PASSWORD FOR THE ELASTIC INSTALL ON YOUR SYSTEM IN './elasticinfo.js'
const [elasticUrl, serverUrl, pageSize] = [elasticInfo.elasticUrl, elasticInfo.serverUrl, elasticInfo.pageSize];
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
        // Jerry - Added some input validation 
        if(!req.params.posterId) return res.status(400).json({error: "Required arg posterId not supplied"});
        if(!req.params.posterUsername) return res.status(400).json({error: "Required arg posterUsername not supplied"});
        if(!req.params.timePosted) return res.status(400).json({error: "Required arg timePosted not supplied"});
        if(!req.params.body) return res.status(400).json({error: "Required arg body not supplied"});
        if(!req.params.songName) return res.status(400).json({error: "Required arg songName not supplied"});
        if(!req.params.artistName) return res.status(400).json({error: "Required arg artistName not supplied"});

        if(typeof(req.params.posterId) != 'string') return res.status(400).json({error: "Required arg posterId invalid type"});
        if(typeof(req.params.posterUsername) != 'string') return res.status(400).json({error: "Required arg posterUsername invalid type"});
        if(typeof(req.params.timePosted) != 'string') return res.status(400).json({error: "Required arg timePosted invalid type"});
        if(typeof(req.params.body) != 'string') return res.status(400).json({error: "Required arg body invalid type"});
        if(typeof(req.params.songName) != 'string') return res.status(400).json({error: "Required arg songName invalid type"});
        if(typeof(req.params.artistName) != 'string') return res.status(400).json({error: "Required arg artistName invaldi type"});

        if(!req.params.posterId.trim()) return res.status(400).json({error: "Required arg posterId cannot be empty space"});
        if(!req.params.posterUsername.trim()) return res.status(400).json({error: "Required arg posterUsername cannot be empty space"});
        if(!req.params.timePosted.trim()) return res.status(400).json({error: "Required arg timePosted ncannot be empty space"});
        if(!req.params.body.trim()) return res.status(400).json({error: "Required arg body cannot be empty space"});
        if(!req.params.songName.trim()) return res.status(400).json({error: "Required arg cannot be empty space"});
        if(!req.params.artistName.trim()) return res.status(400).json({error: "Required arg cannot be empty space"});


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
    /*  
        usage: use query parameter to get results for specified page, starting at page 0
        pass the query in the request body item 'query', and fields to query as a list for item 'fields'. '[]' for every field
        edit pagesize in routes/config
    */
    let page;
    if(!req.query.page){
        page = 0;
    }
    else{
        page = req.query.page;
    }
    const query = req.body.query;
    const fields = req.body.fields;
    const offset = page*pageSize;
    //console.log(query, fields)
    const data = {
        query: {
          multi_match: {
            query: query,
            fields: fields
          }
        }
      };
      //console.log(JSON.stringify(data));
    try{
        let searchData = await instance.post(elasticUrl+'/posts/_search', data);
        //console.log(searchData);
        return res.status(200).json({result: searchData.data.hits.hits});
    }
    catch(e){
        return res.status(400).json({error: e.toString()});
    }
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