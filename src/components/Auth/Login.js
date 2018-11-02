import React, { Component } from 'react'
import noImg from '../../images/noImage.jpg'
import axios from 'axios'
import { connect } from 'react-redux'
import { updateUser } from '../../ducks/reducer'
import Header from '../Nav/Header'

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
        email = email.toLowerCase();
        axios.post(`auth/login`, { email, password })
            .then((response) => {
                let { display_name, profile_pic, user_id, email, approved, isadmin } = response.data;
                this.props.updateUser({ display_name, profile_pic, user_id, email, approved, isadmin })
                window.location = '/#/'
            })
            .catch((err) => {
                console.log(err)
                if(!email || !password){
                    window.alert('Please fill out all fields')
                }
                else {
                    window.alert('Username/Email or password incorrect!')
                }
            })
    }

    pressEnter = (e) => {
        
            if(e.key === 'Enter'){
                this.handleLogin();
            }
        
    }

    render() {
        return (
            <div className='AuthContainer desktop-body'>
            <Header />
                {/* <img className='header' src={noImg} alt="" /> */}
                <h2>Login</h2>
                <div className='input-box'>
                    <input placeholder='Username or Email' onChange={(e) => { this.handleUpdateEmail(e.target.value) }} value={this.state.email} />
                </div>
                <div className='input-box'>
                    <input placeholder='Password' onKeyPress={(e) => {this.pressEnter(e)}} onChange={(e) => { this.handleUpdatePassword(e.target.value) }} value={this.state.password} type='password' />
                </div>
                <button type="submit" onClick={() => { this.handleLogin() }}>Login</button>
                <a href='/#/register'>Click here to register</a>

            </div>
        )
    }
}
function mapStateToProps(state) {
    return {
        user_id: state.user_id
    }
}

export default connect(mapStateToProps, { updateUser })(Login)