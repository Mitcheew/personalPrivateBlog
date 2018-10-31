import React, { Component } from 'react'
import { connect } from 'react-redux'
import axios from 'axios'
import { updateUser } from '../../ducks/reducer'
import { Link } from 'react-router-dom'

class Posts extends Component {
    constructor() {
        super()
        this.state = {
            posts: [],
            search: ''
        }
    }

    componentDidMount() {
        axios.get(`/api/posts`)
            .then((response) => {
                console.log(response.data)
                this.setState({
                    posts: response.data
                })
                console.log(this.state.posts)
            })


    }


    render() {
        let allPosts = this.state.posts.map((post) => {
            return (
                <div key={post.post_id}>
                    <div className='post-container'>
                        <Link to={`/post/${post.post_id}`}>
                            <div className='post-info'>
                                <h2>{post.title}</h2>
                                <img className='profile_pic' src={post.profile_pic} alt="" />
                            </div>
                            <div className='post-info'>
                                <p>Posted date: {post.post_date}</p>
                                <p>By:  {post.display_name}</p>
                            </div>
                        </Link>
                    </div>

                    {/* <img className='profile_pic' src={post.profile_pic} alt="" /> */}
                </div>
            )
        });
        return (
            <div>
                <h1>Most Recent Posts</h1>
                {allPosts}
            </div>
        )
    }
}

function mapStateToProps(state) {
    console.log(state)
    return {
        user_id: state.user_id
    }
}

export default connect(mapStateToProps, { updateUser })(Posts);