import React, { Component } from 'react';
// import logo from './logo.svg';
import './App.css';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import Post from './components/Posts/Post'
import Album from './components/Album/Album'
import Posts from './components/Posts/Posts'
import NewPost from './components/Posts/NewPost'
import Nav from './components/Nav/Nav'
import { HashRouter, Switch, Route } from 'react-router-dom'
import { connect } from 'react-redux'

class App extends Component {
  render() {
    return (
      <HashRouter>
        <div>
          {
            this.props.user_id > 0 ?
              <Nav />
              :
              <div></div>

          }
          
          <Switch>
            <Route exact path='/' component={Posts} />
            <Route path='/post/:post_id' component={Post} />
            <Route path='/login' component={Login} />
            <Route path='/register' component={Register} />
            <Route path='/album' component={Album} />
            <Route path='/settings' component={Album} />
            <Route path='/new' component={NewPost} />
          </Switch>
        </div>
      </HashRouter>
    );
  }
}

function mapStateToProps(state) {
  return {
    user_id: state.user_id
  }
}

export default connect(mapStateToProps)(App);
