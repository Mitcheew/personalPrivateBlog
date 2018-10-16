import React, { Component } from 'react'

class Post extends Component {
    constructor(){
        super()
        this.state = {
            title: '',
            image:'',
            content:'',
            author:'',
            profile_pic:''
        }
    }

    render(){
        return (
            <div>
                Post
            </div>
        )
    }
}

export default Post