
module.exports = {
    getAllPosts: async (req, res) => {

    },
    getPost: async (req, res) => {
        let { title, published, content, post_date, image } = req.body
        // check if that user already exists in our db
        const dbInstance = req.app.get('db')
        let foundUser = await dbInstance.find_user([email, password])

    },
    newPost: async (req, res) => {

    },
    editPost: async (req, res) => {

    },
    deletePost: async (req, res) => {
        
    }
}