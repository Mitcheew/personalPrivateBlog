import React, { Component } from 'react'
import axios from 'axios'
import { connect } from 'react-redux'
import { v4 as randomString } from 'uuid'
import Dropzone from 'react-dropzone'
import { GridLoader } from 'react-spinners'
import Header from '../Nav/Header'

class NewPost extends Component {
    constructor() {
        super()
        let today = new Date(),
            date = (today.getMonth() + 1) + '-' + today.getDate() + '-' + today.getFullYear();
        this.state = {
            title: '',
            image: [],
            content: '',
            publish: false,
            post_date: date,
            isUploading: false,
            url: 'http://via.placeholder.com/450x450',
            value: ''
        }
        this.mapAccepted = this.mapAccepted.bind(this)
    }

    componentDidMount() {

    }

    handleTitleChange(value) {
        this.setState({
            title: value
        })
    }

    handleContentChange(value) {
        this.setState({
            content: value
        })
    }

    handleNewPost() {
        let { title, image, content, post_date, publish } = this.state;
        let { user_id } = this.props
        if (image.length > 0 && title && content) {
            axios.post(`/api/post`, { title, image, content, publish, post_date, user_id })
                .then(response => {
                    console.log(response.data)
                    this.props.history.push(`/post/${response.data.postId}`)
                })

        } else {
            window.alert('Please fill everything out and include at least 1 image')
        }
    }

    mapAccepted(files) {
        let fileAry = files
        console.log(fileAry)
        fileAry.forEach(file => {
            this.getSignedRequest(file)

        })
    }

    getSignedRequest(file) {
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
        let urlAry = this.state.image;
        urlAry.push(url);
        var options = {
            headers: {
                'Content-Type': file.type
            }
        };

        axios.put(signedRequest, file, options)
            .then(response => {
                this.setState({
                    isUploading: false,
                    url: url,
                    image: urlAry
                })
            })
            .catch(err => {
                this.setState({
                    isUploading: false
                })
                console.log(err)
                if (err.response.status === 403) {
                    alert('Your request for a signed URL failed with a status 403. Double check the CORS configuration and bucket policy in the README. You also will want to double check your AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY in your .env and ensure that they are the same as the ones that you created in the IAM dashboard. You may need to generate new keys\n' + err.stack)
                } else {
                    alert(`ERROR: ${err.status}\n ${err.stack}`)
                }
            })
    }
    render() {
        let imageList = this.state.image.map((image, i) => {
            return (
                <img className='profile_pic' key={i} src={image} alt="" />
            )
        })
        return (
            <div className='desktop-body'>
                <Header />
                <h1 className='header'> New Post </h1>
                <div className='input-box'>
                    Title:
                <input className='title' onChange={(e) => { this.handleTitleChange(e.target.value) }} value={this.state.email} />

                </div>
                Images:
                <div className='new-post-upload'>

                    <Dropzone
                        className='Dropzone'
                        onDropAccepted={this.mapAccepted}
                        accept='image/*'
                        multiple={true} >

                        {this.state.isUploading
                            ? <GridLoader />
                            : <p>Drop File or Click Here</p>
                        }
                    </Dropzone>
                    <ol>
                        {imageList}
                    </ol>
                </div>
                <br />
                <h3>Content:</h3>

                <div className='input-box'>
                    <textarea onChange={(e) => { this.handleContentChange(e.target.value) }} value={this.state.displayName} />
                </div>
                <div className='input-box'>

                    <button onClick={() => { this.handleNewPost() }}>Post</button>
                </div>
            </div>

        )
    }
}

function mapStateToProps(state) {
    return {
        user_id: state.user_id
    }
}

export default connect(mapStateToProps)(NewPost)