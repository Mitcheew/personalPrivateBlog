import React, { Component } from 'react'
import noImg from '../../images/noImage.jpg'
import { connect } from 'react-redux'
import axios from 'axios'
import { updateUser } from '../../ducks/reducer'

class Settings extends Component {
    constructor() {
        super()
        this.state = {
            username: '',
            displayName: '',
            profile_pic: noImg,
            password: '',
            email: ''
        }
    }

    componentDidMount() {
        
    }

    handleUpdateUsername(value) {
        this.setState({
            username: value
        })
    }

    handleUpdateDisplayName(value) {
        this.setState({
            displayName: value
        })
    }

    handleUpdateProfile_pic(value) {
        this.setState({
            profile_pic: value
        })
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

    render() {
        return (
            <div>
                <img src={noImg} alt="" />
                Email:
                <input onChange={(e) => { this.handleUpdateEmail(e.target.value) }} value={this.state.email} />
                Password:
                <input onChange={(e) => { this.handleUpdatePassword(e.target.value) }} value={this.state.password} type='password' />
                Display Name:
                <input onChange={(e) => { this.handleUpdateDisplayName(e.target.value) }} value={this.state.displayName} />
                Profile Picture:
                <input onChange={(e) => { this.handleUpdateProfile_pic(e.target.value) }} />
                <button onClick={() => { }}>Save Changes</button>

            </div>
        )
    }
}

export default Settings