const express = require('express');
const axios = require('axios');
const { v4: uuidv4 } = require('uuid');
const https = require('https');
const router = express.Router();
const elasticInfo = require('./elasticInfo');

//EDIT URL, USERNAME, AND PASSWORD FOR THE ELASTIC INSTALL ON YOUR SYSTEM IN './elasticinfo.js'
const elasticUrl = elasticInfo.elasticUrl;
const instance = axios.create({
    httpsAgent: new https.Agent({  
      rejectUnauthorized: false
    }),
    auth: {
        username: elasticInfo.username,
        password: elasticInfo.password
    }
  });

router.post('/create', async (req,res) => {
        const params = req.body;
        //TODO: input verification!!!! 
        //uid is the firebase user's uid
        const [username, uid, profilePicturePath] = [params.username, params.uid, params.profilePicturePath];
        const data = {
            username: username,
            uid: uid,
            profilePicturePath: profilePicturePath,
            likedSongs: [],
            likedArtists: [],
            likedAlbums: []
        };
        const id = uuidv4();
        try{
            let userData = await instance.post(elasticUrl+'/users/_doc/'+id, data)
            //console.log(userData.data);
            return res.status(200).json({userId: id});
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
            let userData = await instance.delete(elasticUrl+'/users/_doc/'+id);
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

module.exports = router;