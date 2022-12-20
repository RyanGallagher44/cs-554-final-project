const express = require('express');
const app = express();
const cors = require('cors');
const session = require('express-session');

const axios = require('axios');
const https = require('https');
const configRoutes = require('./routes');
const elasticInfo = require('./routes/config');

const redis = require("redis");
const client = redis.createClient();
client.connect().then(() => {})

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

app.use(session({
  name: 'AuthCookie',
  secret: 'This is a secret',
  resave: false,
  saveUninitialized: true
}));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: true}));
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

app.get('/lastfm/artists/:id', async (req, res, next) => {
  try {
      if(!req.params.id) res.status(400).json({error: 'Required arg id not supplied'});
      if(typeof(req.params.id) != 'string') res.status(400).json({error: 'Required arg id invalid type'});
      if(!req.params.id.trim()) res.status(400).json({error: 'Required arg id cannot be empty space'});
  } catch (e) {
      return res.status(400).json({error: e});
  }

  console.log('in middleware')
      
  if (await client.hExists('artists', `${req.params.id}`)) {
    const data = await client.hGet('artists', `${req.params.id}`);
    const jsonData = JSON.parse(data);

    console.log(jsonData);

    return res.json(jsonData);
  } else {
    next();
  }
});

app.get('/lastfm/albums/:id', async (req, res, next) => {
  try {
      if(!req.params.id) res.status(400).json({error: 'Required arg id not supplied'});
      if(typeof(req.params.id) != 'string') res.status(400).json({error: 'Required arg id invalid type'});
      if(!req.params.id.trim()) res.status(400).json({error: 'Required arg id cannot be empty space'});
  } catch (e) {
      return res.status(400).json({error: e});
  }

  console.log('in middleware')

  if (await client.hExists('albums', `${req.params.id}`)) {
    const data = await client.hGet('albums', `${req.params.id}`);
    const jsonData = JSON.parse(data);
    return res.json(jsonData);
  } else {
    next();
  }
});

configRoutes(app);

mapping()
.then(()=>{
  app.listen(3030, async () => {
    console.log("Your routes will be running on http://localhost:3030");
  });
})
.catch((e)=>{
  console.error(e.toString());
});