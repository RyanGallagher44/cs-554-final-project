const express = require('express');
const app = express();
const cors = require('cors');
const fs = require('fs');
var im = require('imagemagick');
const axios = require('axios');
const https = require('https');
const configRoutes = require('./routes');
let testImage = "./dog.jpg"
const elasticInfo = require('./routes/config');

const [elasticUrl, postMapping, userMapping] = [elasticInfo.elasticUrl, elasticInfo.postMapping, elasticInfo.userMapping];
const instance = axios.create({
    httpsAgent: new https.Agent({  
      rejectUnauthorized: false
    }),
    auth: {
        username: elasticInfo.username,
        password: elasticInfo.password
    }
  });

const jsonErrorHandler = (err, req, res, next) => {
    res.status(500).send({ error: err.toString() });
  }

app.get('/imageIdentify', function(req, res) {
  im.identify('dog.jpg', function(err, features){
  if (err) throw err;
  res.json({"images_data": features});
  });
});

// app.get('/imageFlip', async function(req, res) {
//   const imgBuffer = await im.convert({
//     srcData: 'dog.jpg',
//     rotate: 90
//   }, function(err, retVal){
//     if(err) throw err;
//     res.json({"returnValue": retVal})
//   })
// });

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: true}));
configRoutes(app);
app.use(jsonErrorHandler);

/* This maps the indexes with the proper field types. We can edit mapping in routes/config.js */
let mapping = async () => {
  let [usersExists, postsExists] = [true, true];
  try{
    await instance.head(elasticUrl+'/users')
  }
  catch(e){
    usersExists = false;
  }
  try{
    await instance.head(elasticUrl+'/posts')
  }
  catch(e){
    postsExists = false;
  }
  if(!usersExists) await instance.put(elasticUrl+'/users', userMapping);
  if(!postsExists) await instance.put(elasticUrl+'/posts', postMapping);
};

mapping()
.then(()=>{
  app.listen(3030, async () => {
    console.log("Your routes will be running on http://localhost:3030");
  });
})
.catch((e)=>{
  console.error(e.toString());
});