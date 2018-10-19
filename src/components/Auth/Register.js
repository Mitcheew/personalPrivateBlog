import React, { Component } from 'react'
import axios from 'axios'
import noImg from '../../images/noImage.jpg'
import { updateUser } from '../../ducks/reducer'
import { connect } from 'react-redux'

class Register extends Component {
    constructor() {
        super()
        this.state = {
            display_name: '',
            profile_pic: noImg,
            password: '',
            email: ''
        }
    }

    componentDidMount() {
        if (this.props.user_id > 0) {
            window.location = '/#/'
        }
    }

    handleUpdateDisplayName(value) {
        this.setState({
            display_name: value
        })
    }

    handleUpdateProfile_pic(value) {
        this.setState({
            profile_pic: value
        })
    }

    addDefaultImg(e) {
        e.target.src = noImg
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

    handleRegistration() {
        let { email, password, profile_pic, display_name } = this.state
        axios.post(`auth/register`, { email, password, profile_pic, display_name })
            .then((response) => {
                let { display_name, profile_pic, user_id, email, approved, isadmin } = response.data;
                console.log(response)
                this.props.updateUser({ display_name, profile_pic, user_id, email, approved, isadmin })
                window.location = '/#/'
            })
            .catch((err) => {
                console.log(err)
            })
    }

    render() {
        return (
            <div>
                <img onError={this.addDefaultImg} src={this.state.profile_pic} alt="" />
                Email:
                <input onChange={(e) => { this.handleUpdateEmail(e.target.value) }} value={this.state.email} />
                Password:
                <input onChange={(e) => { this.handleUpdatePassword(e.target.value) }} value={this.state.password} type='password' />
                Display Name:
                <input onChange={(e) => { this.handleUpdateDisplayName(e.target.value) }} value={this.state.displayName} />
                Profile Picture:
                <input onChange={(e) => { this.handleUpdateProfile_pic(e.target.value) }} />
                <button onClick={() => { this.handleRegistration() }}>Register</button>

            </div>
        )
    }
}

function mapStateToProps(state) {
    return {
        user_id: state.user_id
    }
}

export default connect(mapStateToProps, { updateUser })(Register)