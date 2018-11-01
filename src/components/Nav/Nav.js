import { slide as Menu } from 'react-burger-menu'
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { logout, isDesktop } from '../../ducks/reducer'
import axios from 'axios'

class Nav extends Component {
    constructor(props) {
        super(props)
        this.state = {
            menuOpen: false
        }
        this.logout = this.logout.bind(this)
    }

    componentDidMount() {
        console.log(window.location.pathname)
        this.props.isDesktop();
        window.addEventListener("resize", this.props.isDesktop);
    }

    handleStateChange(state) {
        this.setState({ menuOpen: state.isOpen })
    }

    closeMenu() {
        this.setState({ menuOpen: false })
    }

    logout() {
        axios.get(`/auth/logout`)
            .then(() => {
                this.props.logout()
                this.closeMenu()
                window.location = '/#/login'
            })
    }

    render() {


        return (
            <div>
                {this.props.is_desktop ?
                <div className='desktop-nav-wrapper'>
                {this.props.user_id > 0
                    ?
                    <div>
                        <div className='nav-line'>
    
                            <img src={this.props.profile_pic} alt="" />
    
                            <p>{this.props.display_name}</p>
                        </div>
                        <div className='nav-line'>
    
                            <a id="home" className="menu-item" href="/#/"><button>Home</button></a>
                        </div>
                        <div className='nav-line'>
    
                            <a id="Album" className="menu-item" href='/#/album'><button>Album</button></a>
                        </div>
                        {this.props.isadmin ?
                            <div className='nav-line'>
    
                                <a id="newPost" className="menu-item" href='/#/new'><button>New Post</button></a>
                            </div>
                            :
                            null
                        }
    
    
                        <div className='nav-line'>
    
                            <a id="settings" className="menu-item" href='/#/settings'><button>Settings</button></a>
                        </div>
                        <div className='nav-line'>
                            <button onClick={this.logout}>Logout</button>
                        </div>
                    </div>
                    :
                    <div>
                        <div className='nav-line'>
    
                            <a id="login" className="menu-item" href="/#/login"><button>Login</button></a>
                        </div>
                        <div className='nav-line'>
    
                            <a id="register" className="menu-item" href='/#/register'><button>Register</button></a>
                        </div>
    
                    </div>
                }
                </div>
            :
            <Menu
            right
            width={'180px'}
            isOpen={this.state.menuOpen}
            onStateChange={(state) => this.handleStateChange(state)}
        >

            {this.props.user_id > 0
                ?
                <div>
                    <div className='nav-line'>

                        <img src={this.props.profile_pic} alt="" />

                        <p>{this.props.display_name}</p>
                    </div>
                    <div className='nav-line'>

                        <a id="home" className="menu-item" onClick={() => this.closeMenu()} href="/#/"><button>Home</button></a>
                    </div>
                    <div className='nav-line'>

                        <a id="Album" className="menu-item" onClick={() => this.closeMenu()} href='/#/album'><button>Album</button></a>
                    </div>
                    {this.props.isadmin ?
                        <div className='nav-line'>

                            <a id="newPost" className="menu-item" onClick={() => this.closeMenu()} href='/#/new'><button>New Post</button></a>
                        </div>
                        :
                        null
                    }


                    <div className='nav-line'>

                        <a id="settings" className="menu-item" onClick={() => this.closeMenu()} href='/#/settings'><button>Settings</button></a>
                    </div>
                    <div className='nav-line'>
                        <button onClick={this.logout}>Logout</button>
                    </div>
                </div>
                :
                <div>
                    <div className='nav-line'>

                        <a id="login" className="menu-item" onClick={() => this.closeMenu()} href="/#/login"><button>Login</button></a>
                    </div>
                    <div className='nav-line'>

                        <a id="register" className="menu-item" onClick={() => this.closeMenu()} href='/#/register'><button>Register</button></a>
                    </div>

                </div>
            }
        </Menu>

            }
            </div>
        );
    }
}

function mapStateToProps(state) {
    return {
        display_name: state.display_name,
        profile_pic: state.profile_pic,
        user_id: state.user_id,
        isadmin: state.isadmin,
        is_desktop: state.is_desktop
    }
}

export default connect(mapStateToProps, { logout, isDesktop })(Nav)