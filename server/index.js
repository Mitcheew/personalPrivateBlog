// require in dependencies
require('dotenv').config();
const express = require('express');
const session = require('express-session');
// const axios = require('axios');
const massive = require('massive');
const bodyParser = require('body-parser');
// const bcrypt = require('bcryptjs');
const authController = require('./controllers/auth_controller');
const albumController = require('./controllers/album_controller');
const postController = require('./controllers/post_controller');

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

// /auth
app.post(`/auth/login`, authController.login)
app.post(`/auth/register`, authController.register)
app.put(`/api/users/:user_id`, authController.editUser)

// /api/post
app.get(`/api/posts`, postController.getAllPosts)
app.get(`/api/post/:post_id`, postController.getPost)
app.post(`/api/post`, postController.newPost)
app.put(`/api/post/:post_id`, postController.editPost)
app.delete(`/api/post/:post_id`, postController.deletePost)

// /api/album
app.get(`/api/photos`, albumController.getPhotos)
app.post(`/api/photos`, albumController.addPhoto)
app.delete(`/api/photos/:photo_id`, albumController.deletePhoto)

// listen
app.listen(SERVER_PORT, () => console.log(`Listening on port ${SERVER_PORT}`))

