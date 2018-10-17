// require in dependencies
require('dotenv').config();
const express = require('express');
const session = require('express-session');
const axios = require('axios');
const massive = require('massive');
const bodyParser = require('body-parser');
const c = require('./controller');

// Initialize express app
const app = express();

// destructure from process.env
const {
    SERVER_PORT,
    CONNECTION_STRING,
    SECRET
} = process.env;

app.use(bodyParser.json());
// connect to DB
massive(CONNECTION_STRING)
    .then(dbInstance => {
        app.set('db', dbInstance);
        console.log('Connected to the DB')
    })
    .catch((err) => {
        console.log(err)
    })

// middleware
app.use(session({
    secret: SECRET,
    resave: false,
    saveUninitialized: false
}))
app.use((req, res, next) => {
    next();
})


app.post(`/auth/login`, c.login)
app.post(`/auth/register`, c.register)
app.get(`/api/post/:post_id`, c.getPost)

// listen
app.listen(SERVER_PORT, () => console.log(`Listening on port ${SERVER_PORT}`))

