import React, { Component } from 'react'
import { connect } from 'react-redux'
import axios from 'axios'
import { updateUser } from '../../ducks/reducer'
import { v4 as randomString } from 'uuid'
import Dropzone from 'react-dropzone'
import { GridLoader } from 'react-spinners'

class Settings extends Component {
    constructor(props) {
        super(props)
        this.state = {
            display_name: this.props.display_name,
            profile_pic: this.props.profile_pic,
            currentPassword: '',
            newPassword: '',
            confirmPassword: '',
            email: this.props.email,
            errorMessage: '',
            change: false,
            preview: this.props.profile_pic,
            file: []
        }
    }

    componentDidMount() {
        // if (this.props.profile_pic === null) {
        //     mapStateToProps(this.props)
        // }
    }

    handleUpdateDisplayName(value) {
        this.setState({
            display_name: value
        })
    }

    handleUpdateProfile_pic(value) {
        this.setState({
            profile_pic: value
        })
    }

    handleUpdateEmail(value) {
        this.setState({
            email: value
        })
    }

    handleUpdateCurrentPassword(value) {
        this.setState({
            currentPassword: value
        })
    }

    handleUpdateNewPassword(value) {
        this.setState({
            newPassword: value
        })
    }

    handleUpdateConfirmNewPassword(value) {
        this.setState({
            confirmPassword: value
        })
    }

    handleTikUpdate() {
        if (this.state.change === false) {
            this.setState({
                change: true
            })
        } else {
            this.setState({
                change: false,
                newPassword: '',
                confirmPassword: ''
            })
        }
    }

    previewFile = ([file]) => {
        const currentFile = file
        const reader = new FileReader()
        reader.addEventListener("load", () => {
            this.setState({
                preview: reader.result,
                file: file
            })
        }, false)

        reader.readAsDataURL(currentFile)
        console.log(file)
    }

    previewFile = ([file]) => {
        const currentFile = file
        const reader = new FileReader()
        reader.addEventListener("load", () => {
            this.setState({
                preview: reader.result,
                file: file
            })
        }, false)

        reader.readAsDataURL(currentFile)
        console.log(file)
    }

    getSignedRequest = (file) => {
        console.log(file)
        this.setState({ isUploading: true })
        // We are creating a file name that consists of a random string, and the name of the file that was just uploaded with the spaces removed and hyphens inserted instead. This is done using the .replace function with a specific regular expression. This will ensure that each file uploaded has a unique name which will prevent files from overwriting other files due to duplicate names.
        const fileName = `${randomString()}-${file.name.replace(/\s/g, '-')}`

        // We will now send a request to our server to get a "signed url" from Amazon. We are essentially letting AWS know that we are going to upload a file soon. We are only sending the file-name and file-type as strings. We are not sending the file itself at this point.
        axios.get('/sign-s3', {
            params: {
                'file-name': fileName,
                'file-type': file.type
            }
        }).then((response) => {
            const { signedRequest, url } = response.data
            this.uploadFile(file, signedRequest, url)
        }).catch(err => {
            console.log(err)
        })
    }

    uploadFile = (file, signedRequest, url) => {

        var options = {
            headers: {
                'Content-Type': file.type
            }
        };

        axios.put(signedRequest, file, options)
            .then(response => {
                this.setState({ isUploading: false, profile_pic: url, url: url })
                // THEN DO SOMETHING WITH THE URL. SEND TO DB USING POST REQUEST OR SOMETHING
                let { email, currentPassword, profile_pic, display_name } = this.state
                axios.put(`api/users`, { email, currentPassword, profile_pic, display_name })
                    .then((response) => {
                        let { display_name, profile_pic, user_id, email, approved, isadmin } = response.data;
                        console.log(response)
                        this.props.updateUser({ display_name, profile_pic, user_id, email, approved, isadmin })
                        window.location = '/#/'
                    })
                    .catch((err) => {
                        console.log(err)
                    })
            })
            .catch(err => {
                this.setState({
                    isUploading: false
                })
                if (err.response.status === 403) {
                    alert('Your request for a signed URL failed with a status 403. Double check the CORS configuration and bucket policy in the README. You also will want to double check your AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY in your .env and ensure that they are the same as the ones that you created in the IAM dashboard. You may need to generate new keys\n' + err.stack)
                } else {
                    alert(`ERROR: ${err.status}\n ${err.stack}`)
                }
            })
    }
    sendUpdateToServer() {
        const { file } = this.state;
        if (this.state.preview !== this.props.profile_pic) {
            this.getSignedRequest(file);
        } else {
            let { email, currentPassword, profile_pic, display_name } = this.state
            if (!email || !currentPassword || !display_name) {
                window.alert('Fill out all information fields!')
            } else {
                axios.put(`api/users`, { email, currentPassword, profile_pic, display_name })
                    .then((response) => {
                        let { display_name, profile_pic, user_id, email, approved, isadmin } = response.data;
                        console.log(response)
                        this.props.updateUser({ display_name, profile_pic, user_id, email, approved, isadmin })
                        window.location = '/#/'
                    })
                    .catch((err) => {
                        console.log(err)
                        if (this.props.email !== this.state.email) {
                            window.alert('A user with that email already exists. Use a different email address')
                        } else {
                            window.alert('Password was entered incorrectly. Try again')
                            this.setState({
                                currentPassword: ''
                            })
                        }
                        this.setState({
                            email: this.props.email
                        })
                    })
            }
        }
    }

    render() {
        return (
            <div className='desktop-body'>
                <h1 className='header'> Update your information here </h1>
                <div className='input-box settings-box'>
                    <h3>Email:</h3>
                    <input onChange={(e) => { this.handleUpdateEmail(e.target.value) }} value={this.state.email} />
                </div>
                <div className='input-box settings-box'>
                    <h3>Password:</h3>
                    <input onChange={(e) => { this.handleUpdateCurrentPassword(e.target.value) }} value={this.state.currentPassword} type='password' />
                </div>
                {/* <input type='checkbox' onChange={() => { this.handleTikUpdate() }} />I'd like to change my password */}
                {/* {
                    this.state.change === true ?
                        <div>
                            New Password:
                    <input onChange={(e) => { this.handleUpdateNewPassword(e.target.value) }} value={this.state.newPassword} type='password' />
                            Confirm New Password:
                    <input onChange={(e) => { this.handleUpdateConfirmNewPassword(e.target.value) }} value={this.state.confirmPassword} type='password' />
                        </div>
                        :
                        <div></div>

                } */}
                <div className='input-box settings-box'>
                    <h3>Display Name:</h3>
                    <input onChange={(e) => { this.handleUpdateDisplayName(e.target.value) }} value={this.state.display_name} />
                </div>
                <div className='settingsContainer'>


                    <div className='input-box'>
                        <h3>Profile Picture:</h3>
                        <img className='profile_pic' src={this.state.preview} alt="" />
                    </div>
                    <div>
                        <Dropzone
                            className='Dropzone'
                            onDropAccepted={this.previewFile}
                            accept='image/*'
                            multiple={false} >

                            {this.state.isUploading
                                ? <GridLoader />
                                : <p>Drop File or Click Here</p>
                            }
                        </Dropzone>
                    </div>
                    <div>
                        <button onClick={() => { this.sendUpdateToServer() }}>Save Changes</button>
                    </div>
                </div>
            </div>
        )
    }
}

function mapStateToProps(state) {
    return {
        user_id: state.user_id,
        profile_pic: state.profile_pic,
        display_name: state.display_name,
        email: state.email
    }
}

export default connect(mapStateToProps, { updateUser })(Settings)