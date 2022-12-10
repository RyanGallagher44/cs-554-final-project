const express = require('express');
const axios = require('axios');
const { v4: uuidv4 } = require('uuid');
const https = require('https');
const router = express.Router();

//EDIT URL, USERNAME, AND PASSWORD FOR THE ELASTIC INSTALL ON YOUR SYSTEM.
const elasticUrl = 'https://localhost:9200'
const uname = 'elastic';
const pass = '65MeFjfRlfRjvdFXc4T2';
const instance = axios.create({
    httpsAgent: new https.Agent({  
      rejectUnauthorized: false
    }),
    auth: {
        username: uname,
        password: pass
    }
  });

router.post('/upload', async (req,res) => {
        const params = req.body;
        //TODO: input verification!!!! 
        const [posterId, posterUsername, timePosted, body, songId, songName, artistName, songUrl] = [params.posterId, params.posterUsername, params.timePosted, params.body, params.songId, params.songName, params.artistName, params.songUrl];
        const data = {
            posterId: posterId,
            posterUsername: posterUsername,
            timePosted: timePosted,
            body: body,
            songId: songId,
            songName: songName, 
            artistName: artistName,
            songUrl: songUrl
        };
        const id = uuidv4();
        try{
            let postData = await instance.post(elasticUrl+'/posts/_doc/'+id, data)
            console.log(postData.data);
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
            let postData = await instance.delete(elasticUrl+'/posts/_doc/'+id);
            //console.log(postData);
            return res.status(200).json({result: postData.data.result, postId: id});
        }
        catch(e){
            return res.status(400).json({error: e.toString()});
        }
    }
);

module.exports = router;