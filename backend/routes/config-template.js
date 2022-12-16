//edit these fields with the url, username, and password for elastic on your machine:
//RENAME FILE TO 'config.js'
module.exports = {
    serverUrl: 'http://localhost:3030', //url of the backend api
    elasticUrl: 'https://localhost:9200',//url of elasticsearch (PAY ATTENTION IF YOU NEED HTTP vs HTTPS)
    username: 'elastic',//elastic username
    password: '65MeFjfRlfRjvdFXc4T2',//elastic password
    userMapping: { 
        mappings: {
          properties: {
            username: {
              type: "text"
            },
            uid: {
              type: "keyword"
            },
            profilePicture: {
              enabled: false
            },
            profilePictureName: {
              enabled: false
            },
            likedSongs: {
              type: "keyword"
            },
            likedArtists: {
              type: "keyword"
            },
            likedAlbums: {
              type: "keyword"
            }
          }
        }
      },
    postMapping: {
        mappings: {
            properties: {
                posterId: {
                    type: "keyword"
                },
                posterUsername: {
                    type: "text"
                },
                timePosted: {
                    type: "date"
                },
                body: {
                    type: "text"
                },
                songId: {
                    type: "keyword"
                },
                songName: {
                    type: "text"
                },
                artistName: {
                    type: "text"
                },
                songUrl: {
                    enabled: false
                },
                likes: {
                    type: "keyword"
                },
                replies: {
                    type: "object"
                }
            }
        }
    }
};