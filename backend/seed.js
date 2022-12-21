const axios = require('axios');
const https = require('https');
const arrayToNdjson = require('array-to-ndjson');
const elasticInfo = require('./routes/config');

const [elasticUrl, postMapping, userMapping, serverUrl] = [elasticInfo.elasticUrl, elasticInfo.postMapping, elasticInfo.userMapping, elasticInfo.serverUrl];
const filename = 'default.png';
const instance = axios.create({
    httpsAgent: new https.Agent({  
      rejectUnauthorized: false
    }),
    auth: {
        username: elasticInfo.username,
        password: elasticInfo.password
    },
    headers: {'Content-Type': 'application/x-ndjson'}
  });

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

const buff = arrayToNdjson([
    { "index" : { "_index" : "users", "_id" : "U8qy6ZfSz8TyiEcJKAEx7FXZOw32" } },
    { "fullName": "Anthony Fantano", "userName": "theneedledrop@email.com", "profilePicture": serverUrl+'/users/img/'+ filename, "likedSongs": [], "likedArtists": [], "likedAlbums": [], "likedPosts": ["7e827d7d-6938-4854-ab5f-4c8008b3c64d"]},
    { "index" : { "_index" : "users", "_id" : "NJn6WMEfy1Zu1O1x1vh45DEhgv93" } },
    { "fullName": "Napoleon Bonaparte", "userName": "emperor@france.eu", "profilePicture": serverUrl+'/users/img/'+ filename, "likedSongs": [], "likedArtists": [], "likedAlbums": [], "likedPosts": []},
    { "index" : { "_index" : "users", "_id" : "pPI6R14fBPVnlEPrk37AA3S1sjt1" } },
    { "fullName": "Michael Jackson", "userName": "mj@mail.com", "profilePicture": serverUrl+'/users/img/'+ filename, "likedSongs": [], "likedArtists": [], "likedAlbums": [], "likedPosts": ["ec3df81f-bbc3-4c66-b00c-0231fab2f91f"]},
    { "index" : { "_index" : "users", "_id" : "WC2NiI6ifNdlW23zARqY5C9E0Ks2" } },
    { "fullName": "Albert Einstein", "userName": "albert@mail.com", "profilePicture": serverUrl+'/users/img/'+ filename, "likedSongs": [], "likedArtists": [], "likedAlbums": [], "likedPosts": ["ec3df81f-bbc3-4c66-b00c-0231fab2f91f"]},
    { "index" : { "_index" : "posts", "_id" : "7e827d7d-6938-4854-ab5f-4c8008b3c64d" } },
    {
        "posterId": "NJn6WMEfy1Zu1O1x1vh45DEhgv93",
        "posterUsername": "Napoleon Bonaparte",
        "timePosted": "2022-12-21T03:17:05.796Z",
        "body": "Yet here I was stirred, profoundly stirred, stirred to tears. And by what? By the grief of one dog.",
        "songId": "ec9aed01-23a4-4b20-835d-849c0fc9d69c",
        "songName": "Zombie",
        "artistName": "The Cranberries",
        "artistId": "c98d40fd-f6cf-4b26-883e-eaa515ee2851",
        "artistImage": "https://i.scdn.co/image/143c01f407ed64a4b3bcbc92d24c05ef80981251",
        "songUrl": "https://www.last.fm/music/The+Cranberries/_/Zombie",
        "likes": [
          "U8qy6ZfSz8TyiEcJKAEx7FXZOw32"
        ],
        "replies": [
          {
            "replyId": "26dbf048-7391-44cf-a7c5-398aac580b64",
            "posterId": "U8qy6ZfSz8TyiEcJKAEx7FXZOw32",
            "posterName": "Anthony Fantano",
            "reply": "Great Song!",
            "timePosted": "2022-12-21T03:28:47.929Z"
          }
        ]
      },
      { "index" : { "_index" : "posts", "_id" : "c7da47ff-9087-4786-9f75-f9c7267b29f6" } },
      {
        "posterId": "U8qy6ZfSz8TyiEcJKAEx7FXZOw32",
        "posterUsername": "Anthony Fantano",
        "timePosted": "2022-12-21T03:29:59.913Z",
        "body": "I will work harder, better, faster, stronger to become the best music reviewer on youtube & HeaReal!",
        "songId": "f1a6a40f-78f5-4918-968d-f64363bae94c",
        "songName": "Harder, Better, Faster, Stronger",
        "artistName": "Daft Punk",
        "artistId": "056e4f3e-d505-4dad-8ec1-d04f521cbb56",
        "artistImage": "https://i.scdn.co/image/ab6761610000e5eb96d66c60658005885d1135ce",
        "songUrl": "https://www.last.fm/music/Daft+Punk/_/Harder,+Better,+Faster,+Stronger",
        "likes": [],
        "replies": []
      },
      { "index" : { "_index" : "posts", "_id" : "255bd8f1-f729-4001-b314-12fc92e69e03" } },
      {
        "posterId": "pPI6R14fBPVnlEPrk37AA3S1sjt1",
        "posterUsername": "Michael Jackson",
        "timePosted": "2022-12-21T03:35:23.295Z",
        "body": "Being real for a minute, Bladee inspired me to start singing and focus on my music career!!!!!!!",
        "songId": "a316b9f7-1db8-4a77-9aeb-5e61ba4bafd9",
        "songName": "Girls just want to have fun",
        "artistName": "Bladee",
        "artistId": "cd689e77-dfdd-4f81-b50c-5e5a3f5e38a4",
        "artistImage": "https://i.scdn.co/image/ab6761610000e5eb87e81f834df541e0041d7958",
        "songUrl": "https://www.last.fm/music/Cyndi+Lauper/_/Girls+Just+Want+to+Have+Fun",
        "likes": [],
        "replies": []
      },
      { "index" : { "_index" : "posts", "_id" : "f9969839-58bd-4119-9bd7-784602c46b5f" } },
      {
        "posterId": "NJn6WMEfy1Zu1O1x1vh45DEhgv93",
        "posterUsername": "Napoleon Bonaparte",
        "timePosted": "2022-12-21T03:10:14.872Z",
        "body": "In reality, I'm 5'4 Stand on my money, now I'm 6'6",
        "songId": "e4b347be-ecb2-44ff-aaa8-3d4c517d7ea5",
        "songName": "Everybody Wants to Rule the World",
        "artistName": "Tears for Fears",
        "artistId": "7c7f9c94-dee8-4903-892b-6cf44652e2de",
        "artistImage": "https://i.scdn.co/image/ab6761610000e5eb42ed2cb48c231f545a5a3dad",
        "songUrl": "https://www.last.fm/music/Tears+for+Fears/_/Everybody+Wants+to+Rule+the+World",
        "likes": [],
        "replies": []
      },
      { "index" : { "_index" : "posts", "_id" : "559c32f6-f1ba-4e09-80f1-4e35de1c17e3" } },
      {
        "posterId": "NJn6WMEfy1Zu1O1x1vh45DEhgv93",
        "posterUsername": "Napoleon Bonaparte",
        "timePosted": "2022-12-21T03:12:46.961Z",
        "body": "This song is really helping me survive my exile to st helena...",
        "songId": "5cc1db82-ac3f-4cf5-a5e4-3a7f0418afd8",
        "songName": "Boulevard of Broken Dreams",
        "artistName": "Green Day",
        "artistId": "084308bd-1654-436f-ba03-df6697104e19",
        "artistImage": "https://i.scdn.co/image/ab6761610000e5eb047eac333eff0be4abe32cbf",
        "songUrl": "https://www.last.fm/music/Green+Day/_/Boulevard+of+Broken+Dreams",
        "likes": [],
        "replies": []
      },
      { "index" : { "_index" : "posts", "_id" : "b62ffb7c-1304-4d18-a833-d5e3ffae0094" } },
      {
        "posterId": "pPI6R14fBPVnlEPrk37AA3S1sjt1",
        "posterUsername": "Michael Jackson",
        "timePosted": "2022-12-21T03:36:31.060Z",
        "body": "sometimes I just listen to my own music. ",
        "songId": "6d0c3f07-afbc-422d-94f3-fb3644cf65e0",
        "songName": "Beat It",
        "artistName": "Michael Jackson",
        "artistId": "f27ec8db-af05-4f36-916e-3d57f91ecf5e",
        "artistImage": "https://i.scdn.co/image/ab6761610000e5eb0e08ea2c4d6789fbf5cbe0aa",
        "songUrl": "https://www.last.fm/music/Michael+Jackson/_/Beat+It",
        "likes": [],
        "replies": []
      },
      { "index" : { "_index" : "posts", "_id" : "cc8599f7-0631-425d-8ba8-93a1f9e117b6" } },
      {
        "posterId": "NJn6WMEfy1Zu1O1x1vh45DEhgv93",
        "posterUsername": "Napoleon Bonaparte",
        "timePosted": "2022-12-21T03:33:10.183Z",
        "body": "DRAIN GANG!!!!",
        "songId": "",
        "songName": "Gotham City",
        "artistName": "Bladee",
        "artistId": "cd689e77-dfdd-4f81-b50c-5e5a3f5e38a4",
        "artistImage": "https://i.scdn.co/image/ab6761610000e5eb87e81f834df541e0041d7958",
        "songUrl": "https://www.last.fm/music/Bladee/_/Gotham+City",
        "likes": [
          "pPI6R14fBPVnlEPrk37AA3S1sjt1"
        ],
        "replies": [
          {
            "replyId": "70b1d24a-d4d2-4c82-bc97-3acc41c28639",
            "posterId": "pPI6R14fBPVnlEPrk37AA3S1sjt1",
            "posterName": "Michael Jackson",
            "reply": "frfr",
            "timePosted": "2022-12-21T03:37:26.772Z"
          }
        ]
      },
      { "index" : { "_index" : "posts", "_id" : "d4a901dc-4e8f-47fb-8ef1-3a4b20e20c32" } },
      {
        "posterId": "WC2NiI6ifNdlW23zARqY5C9E0Ks2",
        "posterUsername": "Albert Einstein",
        "timePosted": "2022-12-21T03:41:05.775Z",
        "body": "To be fair, it does require a relatively high iq to understand the nuances of Rick and Morty",
        "songId": "89730a6f-24b9-40aa-93d1-90e824975da0",
        "songName": "Crank That (Soulja Boy)",
        "artistName": "Soulja Boy",
        "artistId": "29eead4d-3793-4625-8727-c03edbb38b8b",
        "artistImage": "https://i.scdn.co/image/ab6761610000e5eba0b85051b7e8ea8c9739a87e",
        "songUrl": "https://www.last.fm/music/Soulja+Boy/_/Crank+That+(Soulja+Boy)",
        "likes": [],
        "replies": []
      },
      { "index" : { "_index" : "posts", "_id" : "81e1f776-e962-485d-ad6f-368f5728f845" } },
      {
        "posterId": "pPI6R14fBPVnlEPrk37AA3S1sjt1",
        "posterUsername": "Michael Jackson",
        "timePosted": "2022-12-21T03:37:03.197Z",
        "body": "I really love parodies! Weird Al is one of the best...",
        "songId": "65cdbcdd-8d91-4b60-a9f2-6c52fbc8943b",
        "songName": "Eat It",
        "artistName": "\"Weird Al\" Yankovic",
        "artistId": "7746d775-9550-4360-b8d5-c37bd448ce01",
        "artistImage": "https://i.scdn.co/image/b0813085ef7141d31b47442be05647b7950fba2e",
        "songUrl": "https://www.last.fm/music/Two+Door+Cinema+Club/_/Eat+That+Up,+It%27s+Good+for+You",
        "likes": [],
        "replies": [
          {
            "replyId": "edbb3359-a1f2-4a71-8267-5143d9e2b650",
            "posterId": "WC2NiI6ifNdlW23zARqY5C9E0Ks2",
            "posterName": "Albert Einstein",
            "reply": "love it!",
            "timePosted": "2022-12-21T03:41:21.866Z"
          }
        ]
      },
      { "index" : { "_index" : "posts", "_id" : "da1e4d2f-244b-4fc2-a9b5-feab197168c0" } },
      {
        "posterId": "WC2NiI6ifNdlW23zARqY5C9E0Ks2",
        "posterUsername": "Albert Einstein",
        "timePosted": "2022-12-21T03:42:36.109Z",
        "body": "this song brings me back to 2007 youtube",
        "songId": "6eab3a76-729f-43c0-9a13-ff74d641beb8",
        "songName": "Dreamscape",
        "artistName": "009 Sound System",
        "artistId": "2245dc3a-4ec6-4ecb-a945-b8249e1f84e0",
        "artistImage": "https://i.scdn.co/image/ab67616d0000b2736298dc3c772f72e70e73d4e8",
        "songUrl": "https://www.last.fm/music/009+Sound+System/_/Dreamscape",
        "likes": [],
        "replies": []
      },
      { "index" : { "_index" : "posts", "_id" : "387ce0de-762b-40b4-8935-76955b7ff87a" } },
      {
        "posterId": "WC2NiI6ifNdlW23zARqY5C9E0Ks2",
        "posterUsername": "Albert Einstein",
        "timePosted": "2022-12-21T03:43:40.808Z",
        "body": "WELL, I'M NOT PARALYZED, BUT I MUST HAVE BEEN STRUCK BY YOU!!!!!!!!!",
        "songId": "202d7dab-5142-4c24-aa6f-b94236f463f9",
        "songName": "Paralyzer",
        "artistName": "Finger Eleven",
        "artistId": "0b76f632-25fa-4681-9862-86499c28afd3",
        "artistImage": "https://i.scdn.co/image/ab6761610000e5ebedb45532edb2265406b6330e",
        "songUrl": "https://www.last.fm/music/Finger+Eleven/_/Paralyzer",
        "likes": [],
        "replies": []
      },
      { "index" : { "_index" : "posts", "_id" : "ec3df81f-bbc3-4c66-b00c-0231fab2f91f" } },
      {
        "posterId": "U8qy6ZfSz8TyiEcJKAEx7FXZOw32",
        "posterUsername": "Anthony Fantano",
        "timePosted": "2022-12-21T03:31:36.744Z",
        "body": "I actually have horrible music taste! I hate bladee even though he basically invented music",
        "songId": "",
        "songName": "Obedient",
        "artistName": "Bladee",
        "artistId": "cd689e77-dfdd-4f81-b50c-5e5a3f5e38a4",
        "artistImage": "https://i.scdn.co/image/ab6761610000e5eb87e81f834df541e0041d7958",
        "songUrl": "https://www.last.fm/music/Bladee/_/Obedient",
        "likes": [
          "pPI6R14fBPVnlEPrk37AA3S1sjt1"
        ],
        "replies": [
          {
            "replyId": "96000090-1b83-485e-a5ea-9ab586bb2882",
            "posterId": "NJn6WMEfy1Zu1O1x1vh45DEhgv93",
            "posterName": "Napoleon Bonaparte",
            "reply": "I for one, am quite the fan of Benjamin 'Bladee' Reichwald!",
            "timePosted": "2022-12-21T03:32:32.135Z"
          }
        ]
      }
]);

let seedMe = async () => {
    await mapping();
    try{
        await instance.post(elasticUrl+'/_bulk', buff);
    }
    catch(e){
        console.log(e.toString());
    }
}
seedMe()
.then(()=>{
    console.log('Successfully seeded elasticsearch!')
})
.catch((e)=>{
  console.error(e.toString());
});