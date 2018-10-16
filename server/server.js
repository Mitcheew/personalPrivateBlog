// require in dependencies
require('dotenv').config();
const express = require('express');
const session = require('express-session');
const axios = require('axios');
const massive = require('massive');
const c = require('./controller')

// Initialize express app
const app = express();

// destructure from process.env
const {
    SERVER_PORT,
    CONNECTION_STRING,
    SECRET
} = process.env;

// connect to DB
massive(CONNECTION_STRING).then(db => app.set('db', db))

// middleware
app.use(session({
    secret: SECRET,
    resave: false,
    saveUninitialized: false
}))

app.post(`/auth/login`, c.login)
app.get(`/api/post/:post_id`, c.post)

// listen
app.listen(SERVER_PORT, () => console.log(`Listening on port ${SERVER_PORT}`))

