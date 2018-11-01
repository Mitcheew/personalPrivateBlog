// require in dependencies
require('dotenv').config();
const express = require('express');
const session = require('express-session');
// const axios = require('axios');
const massive = require('massive');
const bodyParser = require('body-parser');
const aws = require('aws-sdk');
// const bcrypt = require('bcryptjs');
const authController = require('./controllers/auth_controller');
const albumController = require('./controllers/album_controller');
const postController = require('./controllers/post_controller');
// const path = require('path');
// Initialize express app
const app = express();

// app.get('*', (req, res) => {
//     res.sendFile(path.join(__dirname, '../public/index.html'));
// });
app.use( express.static( `${__dirname}/../public` ) );
// destructure from process.env
const {
    SERVER_PORT,
    CONNECTION_STRING,
    SECRET,
    S3_BUCKET,
    AWS_ACCESS_KEY_ID,
    AWS_SECRET_ACCESS_KEY
} = process.env;

app.use(bodyParser.json());

//s3 upload control
app.get('/sign-s3', (req, res) => {

    aws.config = {
      region: 'us-west-1',
      accessKeyId: AWS_ACCESS_KEY_ID,
      secretAccessKey: AWS_SECRET_ACCESS_KEY
    }
    
    const s3 = new aws.S3();
    const fileName = req.query['file-name'];
    const fileType = req.query['file-type'];
    const s3Params = {
      Bucket: S3_BUCKET,
      Key: fileName,
      Expires: 60,
      ContentType: fileType,
      ACL: 'public-read'
    };
  
    s3.getSignedUrl('putObject', s3Params, (err, data) => {
      if(err){
        console.log(err);
        return res.end();
      }
      const returnData = {
        signedRequest: data,
        url: `https://${S3_BUCKET}.s3.amazonaws.com/${fileName}`
      };
  
      return res.send(returnData)
    });
  });

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
app.put(`/api/users/`, authController.editUser)
app.get('/api/user-data', authController.sendUser)
app.get('/auth/logout', authController.logout)
app.get('/api/users', authController.getUsers)
app.put('/api/permissions', authController.approveUser)
app.put('/api/makeAdmin', authController.makeUserAdmin)

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

