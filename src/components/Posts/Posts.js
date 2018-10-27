import React, { Component } from 'react'
import { connect } from 'react-redux'
import axios from 'axios'
import { updateUser } from '../../ducks/reducer'

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
                    <h3>{post.title}</h3>
                    <img src={post.profile_pic} alt="" />
                    <h4>{post.display_name}</h4>
                </div>
            )
        });
        return (
            <div>
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