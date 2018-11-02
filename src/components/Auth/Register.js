import React, { Component } from 'react'
import axios from 'axios'
import noImg from '../../images/noImage.jpg'
import { updateUser } from '../../ducks/reducer'
import { connect } from 'react-redux'
import { v4 as randomString } from 'uuid'
import Dropzone from 'react-dropzone'
import { GridLoader } from 'react-spinners'
import Header from '../Nav/Header'

class Register extends Component {
    constructor() {
        super()
        this.state = {
            profile_pic: 'https://mitcheew-pproject.s3.amazonaws.com/b107c43d-9b5f-4686-b15f-6a364dfeaba7-noImage.jpg',
            password: '',
            email: '',
            url: '',
            file: [],
            preview: ''
        }
    }

    componentDidMount() {
        if (this.props.user_id === 0) {
            window.location = '/#/register'
        }
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

    addDefaultImg(e) {
        e.target.src = noImg
    }

    handleUpdateEmail(value) {
        this.setState({
            email: value
        })
    }

    handleUpdatePassword(value) {
        this.setState({
            password: value
        })
    }

    handleRegistration() {
        const { file } = this.state;
        if (this.state.preview) {
            this.getSignedRequest(file);
        } else {
            let { email, password, profile_pic, display_name } = this.state
            if (!email || !password || !display_name) {
                window.alert('Fill out all information fields!')
            } else {

                email = email.toLowerCase();
                axios.post(`auth/register`, { email, password, profile_pic, display_name })
                    .then((response) => {
                        let { display_name, profile_pic, user_id, email, approved, isadmin } = response.data;
                        console.log(response)
                        this.props.updateUser({ display_name, profile_pic, user_id, email, approved, isadmin })
                        window.location = '/#/'
                    })
                    .catch((err) => {
                        console.log(err)
                        window.alert('A user with that email already exists. Use a different email address or log in')
                        this.setState({
                            email: ''
                        })
                    })
            }
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
                let { email, password, profile_pic, display_name } = this.state
                axios.post(`auth/register`, { email, password, profile_pic, display_name })
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

    render() {
        const { preview } = this.state
        return (
            <div className='AuthContainer desktop-body'>
            <Header />
                {/* <img className='header' src={noImg} alt="" /> */}
                <h2>Register</h2>
                <div className='input-box'>
                    <input placeholder='Username or Email' onChange={(e) => { this.handleUpdateEmail(e.target.value) }} value={this.state.email} />
                </div>
                <div className='input-box'>
                    <input placeholder='Password' onChange={(e) => { this.handleUpdatePassword(e.target.value) }} value={this.state.password} type='password' />
                </div>
                <div className='input-box'>
                    <input placeholder='Display Name' onChange={(e) => { this.handleUpdateDisplayName(e.target.value) }} value={this.state.displayName} />
                </div>
                Profile Picture:
                {preview !== null ? <img className='profile_pic' src={preview} alt="" /> : ''}

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
                <button onClick={() => { this.handleRegistration() }}>Register</button>

            </div>
        )
    }
}

function mapStateToProps(state) {
    return {
        user_id: state.user_id
    }
}

export default connect(mapStateToProps, { updateUser })(Register)