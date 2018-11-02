import React, { Component } from 'react'
import { connect } from 'react-redux'
import axios from 'axios'
import { updateUser } from '../../ducks/reducer'
import { Link } from 'react-router-dom'
import Header from '../Nav/Header'

class Posts extends Component {
    constructor() {
        super()
        this.state = {
            posts: [],
            search: '',
            isPosts: true
        }
    }

    componentDidMount() {
        axios.get(`/api/posts`)
            .then((response) => {
                if (response.data.length > 0) {
                    this.setState({
                        posts: response.data,
                    })
                } else {
                    this.setState({
                        isPosts: false
                    })
                }
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
                            {this.props.is_desktop ?
                                <div>
                                    <img className='post-preview' src={post.image} alt={post.title} />
                                </div>

                                :
                                null
                            }

                        </Link>
                    </div>

                </div>
            )
        });
        return (
            <div className='desktop-body'>
                <Header />
                <h1 className='header'>Most Recent Posts</h1>
                {this.state.posts.length > 0 ?
                    <div id='flex-post-container'>
                        {allPosts}
                    </div>
                    :
                    <div>
                        {this.state.isPosts ?
                            <h1 className='flex-post-preview'>Loading...</h1>

                            :
                            <h1 className='flex-post-preview'>There are no posts</h1>
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
        is_desktop: state.is_desktop
    }
}

export default connect(mapStateToProps, { updateUser })(Posts);