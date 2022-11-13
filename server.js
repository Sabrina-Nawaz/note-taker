const express = require('express');
const path = require('path');
const fs = require('fs');
const notes = require('./db/db.json');

//Initialize express app and define PORT
const app = express();
const PORT = 3001;

//Setting up middleware
app.use(express.json());
app.use(express.urlencoded( {extended: true}));
app.use(express.static('public'));