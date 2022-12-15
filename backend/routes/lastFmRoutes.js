const express = require('express');
const router = express.Router();
const data = require('../data');
const redis = require('redis');
const { default: axios } = require('axios');
const client = redis.createClient();
client.connect().then(() => {});

await axios.get()
// API key
// 36eb50dfc0c662f35dd0273529ed40eb