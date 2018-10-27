import React, { Component } from 'react'
import axios from 'axios'
import { updateUser } from '../../ducks/reducer'
import { connect } from 'react-redux'
import Slider from 'react-slick'

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
            exists: true
        }
    }

    componentDidMount() {
        let location = this.props.location.pathname.split('/post/')
        console.log(Number(location[1]))
        axios.get(`/api/post/${Number(location[1])}`)
            .then((response) => {
                if (response.data.foundPost.length === 0) {
                    this.setState({
                        exists: false
                    })
                } else {
                    console.log(response.data)
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
                        post_date: post_date
                    })
                }
            })
            .catch((err) => {
                console.log(err)
            })


    }

    render() {
        let settings = {
            dots: true,
            accessibility: true,
            centerMode: true,
            lazyLoad: true,
            infinite: true,
            speed: 500,
            slidesToShow: 1,
            slidesToScroll: 1,
            customPaging: (i) => {
                return (
                    <a>
                        <img style={{
                            maxHeight: "50px",
                            marginRight: "10px"
                        }}
                            src={this.state.image[i].image} />
                    </a>
                );
            },

        };
        let photoReel = this.state.image.map(photo => {
            return (
                <div key={photo.photo_id}>
                    <img src={photo.image} alt="" />
                </div>
            )
        })
        return (
            <div>
                {
                    this.state.exists === true ?
                        <div>
                            {
                                this.props.approved || this.props.isadmin === true ?
                                    <div>
                                        <div>
                                            <h1>{this.state.title}</h1>
                                            {/* admin edit and delete buttons */}
                                            <div>
                                                {
                                                    this.props.isadmin === true ?
                                                        <div>
                                                            <button>Edit</button>
                                                            <button>Delete</button>
                                                        </div>
                                                        :
                                                        <div></div>
                                                }
                                            </div>
                                            Posted by: {this.state.author}
                                            <img src={this.state.profile_pic} alt="" />
                                        </div>
                                        <div>

                                            <Slider {...settings}>
                                                {photoReel}
                                            </Slider>
                                            <p>{this.state.content}</p>
                                        </div>
                                        <div>
                                            <input />
                                            <button>Add Comment</button>
                                        </div>
                                        <div>
                                            {/* Comments section */}
                                        </div>
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
    console.log(state)
    return {
        user_id: state.user_id,
        approved: state.approved,
        isadmin: state.isadmin
    }
}

export default connect(mapStateToProps, { updateUser })(Post);