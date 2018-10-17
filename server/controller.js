let photos = [];
let users = [];

module.exports = {
    login: async (req, res) => {
        let { email, password } = req.body
        // check if that user already exists in our db
        const dbInstance = req.app.get('db')
        let foundUser = await dbInstance.find_user([email, password])
        .catch((err) => {
            console.log(err)
        })
        console.log(foundUser)
        if (foundUser[0]) {
            // found user existing in the db, put returned user on session
            req.session.user = foundUser[0];
            res.status(200).send(foundUser[0])
        } else {
            // email or password do not match
            res.status(401).send('Email or password entered was incorrect')
        }
    },

    register: async (req, res) => {
        let { email, password, profile_pic, display_name } = req.body
        let isAdmin = false;
        let approved = false;
        // check if that user already exists in our db
        const dbInstance = req.app.get('db')
        let foundUser = await dbInstance.check_users([email])
        .catch((err) => {
            console.log(err)
        })
        console.log(email)
        if (foundUser[0]) {

            res.status(200).send('A user with that email already exists. Register with a different email.')
        } else if(!email || !password || !display_name){
            res.status(401).send('Please fill out all information fields')
            
        } else {
            // no user was found in the db
            let createdCust = await dbInstance.create_user([email, password, profile_pic, isAdmin, approved, display_name])
            .catch((err) => {
                console.log(err)
            })
            req.session.user = createdCust[0];
            res.sendStatus(200)
        }

    },

    getPost: async (req, res) => {
        let { title, published, content, post_date, image } = req.body
        // check if that user already exists in our db
        const dbInstance = req.app.get('db')
        let foundUser = await dbInstance.find_user([email, password])

    }
}