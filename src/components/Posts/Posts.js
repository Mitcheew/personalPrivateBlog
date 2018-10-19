import React, { Component } from 'react'
import { connect } from 'react-redux'

class Posts extends Component {
    constructor(){
        super()
        this.state = {
            posts: [],
            search:''
        }
    }

    componentDidMount() {
        if (!this.props.user_id || this.props.user_id === 0) {
            window.location = '/#/login'
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

function mapStateToProps(state) {
    console.log(state)
  return {
    user_id: state.user_id
  }
}

export default connect(mapStateToProps)(Posts);