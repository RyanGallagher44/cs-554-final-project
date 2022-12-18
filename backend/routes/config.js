//edit these fields with the url, username, and password for elastic on your machine:
module.exports = {
    serverUrl: 'https://localhost:3030', //url of the backend api
    elasticUrl: 'https://localhost:9200',
    username: 'elastic',
    password: '_IK+dkeLiVZJ8XcXuaCC',
    userMapping: {
        mappings: {
          properties: {
            fullName: {
              type: "text"
            },
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
            },
            likedPosts: {
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
                    type: "text"
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