import React from 'react'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'

function Nav(props) {
    console.log(props)
    return (
        <div>
            {props.user_id > 0
                ?
                <div>
                    <Link to='/'>Posts</Link>
                    <Link to='/album'>Album</Link>
                    <Link to='/'>Account Settings</Link>
                    <p>{props.name}</p>
                    <img src={props.profile_pic} alt=""/>
                </div>
                :
                <div>
                    <Link to='/login'>Login</Link>
                    <Link to='/register'>Register</Link>
                </div>
            }
        </div>
    )
}

function mapStateToProps(state) {
    return {
        display_name: state.display_name,
        profile_pic: state.profile_pic,
        user_id: state.user_id
    }
}

export default connect(mapStateToProps)(Nav)