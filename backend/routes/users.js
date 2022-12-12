const express = require('express');
const multer = require('multer');
const axios = require('axios');
const { v4: uuidv4 } = require('uuid');
const https = require('https');
const path = require('path');
const fs = require('fs/promises');
const router = express.Router();
const elasticInfo = require('./config');
const { fstat } = require('fs');
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

router.post('/create', upload.single('avatar'), async (req,res) => {
        const params = req.body;
        //TODO: input verification!!!! 
        //uid is the firebase user's uid
        let filename
        if(typeof req.file !== 'undefined'){
            filename = req.file.filename;
        }else{
            filename = 'default.png';
        }
        const [username, uid] = [params.username, params.uid];
        const data = {
            username: username,
            uid: uid,
            profilePicture: serverUrl+'/users/img/'+ filename,
            profilePictureName: filename,
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
.get('/img/default', async(req,res)=>{
    //TODO: verify inputs and error handling
    const imgpath = '../uploads/default.png';
    return res.sendFile(path.join(__dirname, imgpath));
})
.get('/img/:filename', async(req,res)=>{
        //TODO: verify inputs & error checking
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