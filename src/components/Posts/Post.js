import React, { Component } from 'react'
import axios from 'axios'
import { updateUser } from '../../ducks/reducer'
import { connect } from 'react-redux'
import Slider from 'react-slick'
import { v4 as randomString } from 'uuid'
import Header from '../Nav/Header'
// import Dropzone from 'react-dropzone'
// import { GridLoader } from 'react-spinners'

class Post extends Component {
    constructor() {
        super()
        this.state = {
            title: '',
            image: [],
            content: '',
            author: '',
            profile_pic: '',
            post_date: '',
            exists: true,
            edit: false,
            newImages: [],
            preview: [],
            nav1: null,
            nav2: null
        }
    }

    componentDidMount() {
        let location = this.props.location.pathname.split('/post/')
        axios.get(`/api/post/${Number(location[1])}`)
            .then((response) => {
                if (response.data.foundPost.length === 0) {
                    this.setState({
                        exists: false
                    })
                } else {
                    let { title, content, display_name, profile_pic, post_date } = response.data.foundPost[0];
                    let postImages = []
                    response.data.postPhotos.forEach((image, i) => {
                        postImages.push(image)
                    })

                    this.setState({
                        title: title,
                        image: postImages,
                        content: content,
                        author: display_name,
                        profile_pic: profile_pic,
                        post_date: post_date,
                        nav1: this.slider1,
                        nav2: this.slider2
                    })
                }
            })
            .catch((err) => {
                console.log(err)
            })
        this.setState({
        })


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
    toggleEdit() {
        if (this.state.edit === false) {
            this.setState({
                edit: true
            })
        } else {
            this.setState({
                edit: false
            })
            this.componentDidMount()
        }
    }

    saveChanges() {
        let loc = this.props.location.pathname.split('/post/')
        let { title, content } = this.state
        console.log(Number(loc[1]))
        axios.put(`/api/post/${Number(loc[1])}`, { title, content })
            .then(() => {
                window.alert('Saved changes successfully!')
                window.location.reload();
            })
    }

    deletePost() {
        let res = window.confirm("Are you sure you want to delete this post?")
        if (res === true) {
            let loc = this.props.location.pathname.split('/post/')
            console.log(Number(loc[1]))
            axios.delete(`/api/post/${Number(loc[1])}`)
                .then(() => {
                    window.alert('Post successfully deleted')
                    window.location = '/#/'
                })

        }

    }


    mapAccepted(files) {
        let fileAry = files
        console.log(fileAry)
        fileAry.forEach(file => {
            this.getSignedRequest(file)

        })
    }

    // previewFile(files){
    //     let currentFile = []
    //     let previewAry = []
    //     let reader = []
    //     console.log(files)
    //     files.forEach((file, i) => {
    //     reader[i] = new FileReader()
    //     reader[i].addEventListener("load", () => {
    //         previewAry[i] = reader.result
    //         currentFile[i] = file
    //     }, false)
    //     console.log(file)
    //     reader[i].readAsDataURL(file)

    //     })

    //     console.log('previewAry,', previewAry, 'currentFile,', currentFile)
    //         this.setState({
    //             preview: previewAry,
    //             newImages: currentFile
    //         })
    // }

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
        let settings = {
            dots: false,
            lazyLoad: true,
            infinite: true,
            speed: 100,
            slidesToShow: 1,
            slidesToScroll: 1

        };
        let photoReel = this.state.image.map(photo => {
            return (
                <div key={photo.photo_id}>
                    <div className='center-slide'>
                        <img src={photo.image} alt="" />
                    </div>
                </div>
            )
        })
        // let imageList = this.state.newImages.map((image, i) => {
        //     return (
        //         <img src={image} key={i} />
        //     )
        // })
        return (
            <div className='desktop-body'>
                <Header />
                {
                    this.state.exists === true ?
                        <div className='post-container-desktop'>
                            {
                                this.props.approved || this.props.isadmin === true ?
                                    <div>
                                        {
                                            this.state.edit === false ?
                                                <div>
                                                    {this.state.author ?
                                                        <div>
                                                            <div className='header post-info'>

                                                                <h1>{this.state.title}</h1>
                                                                {/* admin edit and delete buttons */}
                                                                <div>
                                                                    {
                                                                        this.props.isadmin === true ?
                                                                            <div>
                                                                                <button onClick={() => { this.toggleEdit() }}>Edit</button>
                                                                                <button onClick={() => { this.deletePost() }}>Delete</button>
                                                                            </div>
                                                                            :
                                                                            <div></div>
                                                                    }
                                                                </div>
                                                                <img className='profile_pic' src={this.state.profile_pic} alt="" />
                                                            </div>
                                                            <div className='post-info'>
                                                                <p>Posted date: {this.state.post_date}</p>
                                                                <p>By:  {this.state.author}</p>
                                                            </div>

                                                        </div>
                                                        :
                                                        <h1>Loading...</h1>
                                                    }
                                                    <div>

                                                        <Slider
                                                            asNavFor={this.state.nav2}
                                                            ref={slider => (this.slider1 = slider)}
                                                            {...settings}
                                                        >
                                                            {photoReel}
                                                        </Slider>

                                                        <Slider
                                                            className='SliderPhotos'
                                                            dots={false}
                                                            lazyLoad={true}
                                                            infinite={true}
                                                            speed={100}
                                                            slidesToScroll={1}
                                                            asNavFor={this.state.nav1}
                                                            ref={slider => (this.slider2 = slider)}
                                                            slidesToShow={photoReel.length < 5 ?
                                                                photoReel.length
                                                                :
                                                                5
                                                            }
                                                            swipeToSlide={true}
                                                            focusOnSelect={true}
                                                        >
                                                            {photoReel.length > 1 ?
                                                                photoReel
                                                                :
                                                                null
                                                            }
                                                        </Slider>
                                                        <p>{this.state.content}</p>
                                                    </div>
                                                    {/* <div>
                                        <input />
                                        <button>Add Comment</button>
                                    </div> */}
                                                    <div>
                                                        {/* Comments section */}
                                                    </div>
                                                </div>
                                                :
                                                //edit mode on
                                                <div>
                                                    <div>
                                                        <h1><input onChange={(e) => { this.handleTitleChange(e.target.value) }} value={this.state.title} /></h1>
                                                        {/* admin edit and delete buttons */}
                                                        <div>
                                                            {
                                                                this.props.isadmin === true ?
                                                                    <div>
                                                                        <button onClick={() => { this.toggleEdit() }}>Cancel</button>
                                                                        <button onClick={() => { }}>Delete</button>
                                                                    </div>
                                                                    :
                                                                    <div></div>
                                                            }
                                                        </div>
                                                        Posted by: {this.state.author}
                                                        <img className='profile_pic' src={this.state.profile_pic} alt="" />
                                                    </div>
                                                    <div>
                                                        {/* <Dropzone
                                            onDropAccepted={this.previewFile}
                                            style={{
                                                position: 'relative',
                                                width: 200,
                                                height: 200,
                                                borderWidth: 7,
                                                marginTop: 100,
                                                borderColor: 'rgb(102, 102, 102)',
                                                borderStyle: 'dashed',
                                                borderRadius: 5,
                                                display: 'flex',
                                                justifyContent: 'center',
                                                alignItems: 'center',
                                                fontSize: 28,
                                            }}
                                            accept='image/*'
                                            multiple={true} >

                                            {this.state.isUploading
                                                ? <GridLoader />
                                                : <p>Drop File or Click Here</p>
                                            }
                                        </Dropzone>
                                        <ol>
                                            {imageList}
                                        </ol> */}
                                                        {photoReel}
                                                        <p><textarea onChange={(e) => { this.handleContentChange(e.target.value) }} value={this.state.content} /></p>
                                                        <button onClick={() => { this.saveChanges() }}>Save Changes</button>
                                                    </div>
                                                </div>
                                        }
                                    </div>
                                    :
                                    <div>
                                        You have not been approved to view this page.
                        </div>
                            }
                        </div>
                        :
                        <div>
                            {
                                this.props.approved || this.props.isadmin === true ?
                                    <div>
                                        This page does not exist
                            </div>
                                    :
                                    <div>
                                        You have not been approved to view this page.
                    </div>

                            }
                        </div>


                }

            </div>




        )

    }
}

function mapStateToProps(state) {
    return {
        user_id: state.user_id,
        approved: state.approved,
        isadmin: state.isadmin
    }
}

export default connect(mapStateToProps, { updateUser })(Post);