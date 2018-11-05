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
        let approved = true;
        // check if that user already exists in our db
        const dbInstance = req.app.get('db')
        let foundUser = await dbInstance.check_users([email])
            .catch((err) => {
                console.log(err)
            })
        if (foundUser[0]) {

            res.sendStatus(400)
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
        const dbInstance = req.app.get('db')
        if (req.session.user) {
            let { email, currentPassword, newPassword, profile_pic, display_name } = req.body;
            if (req.session.user.email === email) {
                let currentUser = await dbInstance.find_user([email])
                    .catch((err) => {
                        console.log(err)
                    })

                if (bcrypt.compareSync(currentPassword, currentUser[0].password)) {
                    if (newPassword) {
                        let hash = bcrypt.hashSync(newPassword, 10)
                        let updatedUser = await dbInstance.edit_user([req.session.user.user_id, email, hash, profile_pic, display_name])
                        console.log(updatedUser)
                        let user = {
                            user_id: updatedUser[0].user_id,
                            email: updatedUser[0].email,
                            profile_pic: updatedUser[0].profile_pic,
                            isadmin: updatedUser[0].isadmin,
                            approved: updatedUser[0].approved,
                            display_name: updatedUser[0].display_name,
                        }
                        req.session.user = user
                        res.status(200).send(updatedUser[0])
                    } else {
                        let updatedUser = await dbInstance.edit_user_nopasschange([req.session.user.user_id, email, profile_pic, display_name])
                        console.log(updatedUser)
                        let user = {
                            user_id: updatedUser[0].user_id,
                            email: updatedUser[0].email,
                            profile_pic: updatedUser[0].profile_pic,
                            isadmin: updatedUser[0].isadmin,
                            approved: updatedUser[0].approved,
                            display_name: updatedUser[0].display_name,
                        }
                        req.session.user = user
                        res.status(200).send(updatedUser[0])
                    }
                } else {
                    // Passwords don't match
                    res.status(401).send('\'Current password\' entered is incorrect')
                }
            } else {
                let foundUser = await dbInstance.check_users([email])
                    .catch((err) => {
                        console.log(err)
                    })
                if (foundUser[0]) {
                    res.status(400).send('A user with that email already exists. Use a different email.')
                } else {
                    let currentUser = await dbInstance.find_user([req.session.user.email])
                        .catch((err) => {
                            console.log(err)
                        })
                    if (bcrypt.compareSync(currentPassword, currentUser[0].password)) {
                        if (newPassword) {
                            let hash = bcrypt.hashSync(newPassword, 10)
                            let updatedUser = await dbInstance.edit_user([req.session.user.user_id, email, hash, profile_pic, display_name])
                            console.log(updatedUser)
                            let user = {
                                user_id: updatedUser[0].user_id,
                                email: updatedUser[0].email,
                                profile_pic: updatedUser[0].profile_pic,
                                isadmin: updatedUser[0].isadmin,
                                approved: updatedUser[0].approved,
                                display_name: updatedUser[0].display_name,
                            }
                            req.session.user = user
                            res.status(200).send(updatedUser[0])
                        } else {
                            let updatedUser = await dbInstance.edit_user_nopasschange([req.session.user.user_id, email, profile_pic, display_name])
                            console.log(updatedUser)
                            let user = {
                                user_id: updatedUser[0].user_id,
                                email: updatedUser[0].email,
                                profile_pic: updatedUser[0].profile_pic,
                                isadmin: updatedUser[0].isadmin,
                                approved: updatedUser[0].approved,
                                display_name: updatedUser[0].display_name,
                            }
                            req.session.user = user
                            res.status(200).send(updatedUser[0])
                        }
                    } else {
                        // Passwords don't match
                        res.status(401).send('\'Current password\' entered is incorrect')
                    }

                    // let updatedUser = await dbInstance.edit_user([req.session.user.user_id, email, currentPassword, profile_pic, display_name])
                    // console.log(updatedUser)
                    // let user = {
                    //     user_id: updatedUser[0].user_id,
                    //     email: updatedUser[0].email,
                    //     profile_pic: updatedUser[0].profile_pic,
                    //     isadmin: updatedUser[0].isadmin,
                    //     approved: updatedUser[0].approved,
                    //     display_name: updatedUser[0].display_name,
                    // }
                    // res.status(200).send(user)
                }
            }
        }
    },
    getUsers: async (req, res) => {
        const dbInstance = req.app.get('db')
        if (req.session.user && req.session.user.isadmin === true) {
            users = await dbInstance.get_users()
            res.status(200).send(users)
        } else {
            res.status(401).send('Not authorized')
        }
    },
    approveUser: async (req, res) => {
        const dbInstance = req.app.get('db')
        if (req.session.user && req.session.user.isadmin === true) {
            let { user_id, approved } = req.body
            await dbInstance.approve_user([user_id, approved])
        } else {
            res.status(401).send('Not authorized')
        }
    },
    makeUserAdmin: async (req, res) => {
        const dbInstance = req.app.get('db')
        if (req.session.user && req.session.user.isadmin === true) {
            let { user_id, isadmin } = req.body
            await dbInstance.make_admin([user_id, isadmin])

        } else {
            res.status(401).send('Not authorized')
        }
    },
    sendUser: async (req, res) => {
        const dbInstance = req.app.get('db')
        if (req.session.user) {
            let foundUser = await dbInstance.find_user([req.session.user.email])
            let user = {
                user_id: foundUser[0].user_id,
                email: foundUser[0].email,
                profile_pic: foundUser[0].profile_pic,
                isadmin: foundUser[0].isadmin,
                approved: foundUser[0].approved,
                display_name: foundUser[0].display_name,
            }
            req.session.user = user;
            res.status(200).send(req.session.user)
        } else {
            res.status(401).send(`Go log in`)
        }
    },
    logout: async (req, res) => {
        req.session.destroy();
        res.sendStatus(200)
    }
}