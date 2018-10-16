import React, { Component } from 'react'

class Posts extends Component {
    constructor(){
        super()
        this.state = {
            posts: [],
            search:''
        }
    }

    render(){
        return (
            <div>
                Posts
            </div>
        )
    }
}

export default Posts