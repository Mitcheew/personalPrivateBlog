let posts = [];
let photos = [];

module.exports = {
    getAllPosts: async (req, res) => {
        const dbInstance = req.app.get('db')
        let foundPosts = await dbInstance.get_all_posts()
        res.status(200).send(foundPosts)

    },
    getPost: async (req, res) => {
        let { post_id } = req.params;
        const dbInstance = req.app.get('db')
        let postPhotos = await dbInstance.get_post_photos([post_id])
        let foundPost = await dbInstance.get_post([post_id])
        res.status(200).send({ foundPost, postPhotos })

    },
    newPost: async (req, res) => {
        let { title, publish, content, user_id, post_date, image } = req.body
        const dbInstance = req.app.get('db')
        
        if (req.session.user && req.session.user.isadmin === true) {
            let new_post = await dbInstance.new_post([title, publish, content, user_id, post_date])
            let postId = new_post[0].post_id;
            image.forEach((images) => {
                dbInstance.add_photo([images, postId, user_id])
            })
            res.status(200).send({postId})
        } else {
            res.status(401).send('not authorized')
        }
    },
    editPost: async (req, res) => {
        let { title, content } = req.body
        let { post_id } = req.params
        const dbInstance = req.app.get('db')
        if (req.session.user && req.session.user.isadmin === true) {
            let editPost = await dbInstance.edit_post([ post_id, title, content ])
            res.status(200).send(editPost)
        } else {
            res.status(401).send('not authorized')
        }

    },
    deletePost: async (req, res) => {
        let { post_id } = req.params;
        const dbInstance = req.app.get('db')
        dbInstance.delete_post([ post_id ])
        res.sendStatus(200)
        if (req.session.user && req.session.user.isadmin === true) {
            dbInstance.delete_post([ post_id ])
            res.sendStatus(200)
        } else {
            res.status(401).send('not authorized')
        }

    }
}