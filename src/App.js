import React, { Component } from 'react';
// import logo from './logo.svg';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import Post from './components/Posts/Post'
import Album from './components/Album/Album'
import Posts from './components/Posts/Posts'
import NewPost from './components/Posts/NewPost'
// import Nav from './components/Nav/Nav'
import Nav from './components/Nav/Nav'
import Settings from './components/Auth/Settings'
import { HashRouter, Switch, Route } from 'react-router-dom'
import { connect } from 'react-redux'
import { updateUser } from './ducks/reducer'
import axios from 'axios'


class App extends Component {
  constructor() {
    super()
    this.state = {
    }
  }
  componentDidMount() {
    if (this.props.user_id === 0) {
      axios.get(`/api/user-data`)
        .then((response) => {
          this.props.updateUser(response.data)
        })
        .catch(() => {
          console.log(window.location)
          if (window.location.href === window.location.origin + '/#/register') {

          } else {
            window.location = '/#/login'
          }
        })
    }
  }
  
  

  render() {
    return (
      <HashRouter>
        <div>
          {/* <link rel="stylesheet" type="text/css" charset="UTF-8" href="https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.6.0/slick.min.css" />
          <link rel="stylesheet" type="text/css" href="https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.6.0/slick-theme.min.css" /> */}

              <Nav />
          
          <Switch>
            <Route exact path='/' component={Posts} />
            <Route path='/post/:post_id' component={Post} />
            <Route path='/login' component={Login} />
            <Route path='/register' component={Register} />
            <Route path='/album' component={Album} />
            <Route path='/settings' component={Settings} />
            <Route path='/new' component={NewPost} />
          </Switch>
        </div>
      </HashRouter>
    );
  }
}

function mapStateToProps(state) {
  return {
    display_name: state.display_name,
    profile_pic: state.profile_pic,
    user_id: state.user_id
  }
}

export default connect(mapStateToProps, { updateUser })(App);
