const bcrypt = require('bcryptjs');
let users = [];

module.exports = {
    login: async (req, res) => {
        let { email, password } = req.body
        // check if that user already exists in our db
        const dbInstance = req.app.get('db')

        let foundUser = await dbInstance.find_user([email])
            .catch((err) => {
                console.log(err)
            })


        if (foundUser[0]) {
            // found user existing in the db, put returned user on session
            if (bcrypt.compareSync(password, foundUser[0].password)) {
                let user = {
                    user_id: foundUser[0].user_id,
                    email: foundUser[0].email,
                    profile_pic: foundUser[0].profile_pic,
                    isadmin: foundUser[0].isadmin,
                    approved: foundUser[0].approved,
                    display_name: foundUser[0].display_name,
                }
                // Passwords match
                req.session.user = user;
        console.log(req.session.user)
                res.status(200).send(req.session.user)
            } else {
                // Passwords don't match
                res.status(401).send('Email or password entered was incorrect')
            }
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
        } else if (!email || !password || !display_name) {
            res.status(401).send('Please fill out all information fields')

        } else {
            // no user was found in the db
            let hash = bcrypt.hashSync(password, 10)
            let createdCust = await dbInstance.create_user([email, hash, profile_pic, isAdmin, approved, display_name])
                .catch((err) => {
                    console.log(err)
                })
                let user = {
                    user_id: createdCust[0].user_id,
                    email: createdCust[0].email,
                    profile_pic: createdCust[0].profile_pic,
                    isadmin: createdCust[0].isadmin,
                    approved: createdCust[0].approved,
                    display_name: createdCust[0].display_name,
                }
            req.session.user = user;
            res.status(200).send(req.session.user)
        }

    },
    editUser: async (req, res) => {

    }
}