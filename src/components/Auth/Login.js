import React, { Component } from 'react'
import noImg from '../../images/noImage.jpg'
import axios from 'axios'
import { connect } from 'react-redux'
import { updateUser } from '../../ducks/reducer'

class Login extends Component {
    constructor() {
        super()
        this.state = {
            email: '',
            password: ''
        }
    }

    componentDidMount() {
        if (this.props.user_id > 0) {
            window.location = '/#/'
        }
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

    handleLogin() {
        let { email, password } = this.state
        axios.post(`auth/login`, { email, password })
            .then((response) => {
                let { display_name, profile_pic, user_id, email, approved, isadmin } = response.data;
                console.log(user_id)
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
                <div>
                    <img src={noImg} alt="" />
                    Email:
                    <input onChange={(e) => { this.handleUpdateEmail(e.target.value) }} value={this.state.email} />
                    Password:
                    <input onChange={(e) => { this.handleUpdatePassword(e.target.value) }} value={this.state.password} type='password' />
                    <button onClick={() => { this.handleLogin() }}>Login</button>
                    <a href='/#/register'>Click here to register</a>
                </div>
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

export default connect(mapStateToProps, { updateUser })(Login)