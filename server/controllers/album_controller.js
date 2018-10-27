let photos = [];

module.exports = {
    getPhotos: async (req, res) => {
        const dbInstance = req.app.get('db')
        let photos = await dbInstance.get_all_photos()
        res.status(200).send(photos)
    },
    addPhoto: async (req, res) => {
        let { image, post_id, user_id } = req.body
        const dbInstance = req.app.get('db')
        console.log(req.session.user)
        if (req.session.user && req.session.user.isadmin === true) {
            image.forEach((images) => {
                dbInstance.add_photo([images, post_id, user_id])
            })
            res.sendStatus(200)
        } else {
            res.status(401).send('not authorized')
        }
    },
    deletePhoto: async (req, res) => {
        let { photo_id } = req.params;
        const dbInstance = req.app.get('db')
        res.sendStatus(200)
        if (req.session.user && req.session.user.isadmin === true) {
            await dbInstance.delete_photo([photo_id])
            res.sendStatus(200)
        } else {
            res.status(401).send('not authorized')
        }
    }
}