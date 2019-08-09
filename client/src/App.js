import React, { Fragment, useEffect } from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import NavBar from './components/layout/NavBar';
import Landing from './components/layout/Landing';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import Dashboard from './components/dashboard/Dashboard';
import CreateProfile from './components/profile-form/CreateProfile';
import Profiles from './components/profiles/Profiles';
import Profile from './components/profile/Profile';
import EditProfile from './components/profile-form/EditProfile';
import AddEducation from './components/profile-form/AddEducation';
import AddExperience from './components/profile-form/AddExperience';
import PrivateRoute from './components/routing/PrivateRoute';
import Posts from './components/posts/Posts';
import Post from './components/posts/Post';
import Alert from './components/layout/Alert';
import './App.css';
//Redux
import { Provider } from 'react-redux';
import store from './store';
import setAuthToken from './utills/setAuthToken';
import { loadUser } from './actions/auth';

if (localStorage.token) {
  setAuthToken(localStorage.token);
}
const App = () => {
  useEffect(() => {
    store.dispatch(loadUser());
  }, []);
  return (
    <Provider store={store}>
      <Router>
        <Fragment>
          <NavBar />
          <Route exact path='/' component={Landing} />
          <section className='container'>
            <Alert />
            <Route exact path='/login' component={Login} />
            <Route exact path='/profiles' component={Profiles} />
            <Route exact path='/register' component={Register} />
            <Route exact path='/profile/:id' component={Profile} />
            <PrivateRoute exact path='/posts' component={Posts} />
            <PrivateRoute exact path='/post/:id' component={Post} />
            <PrivateRoute exact path='/dashboard' component={Dashboard} />
            <PrivateRoute
              exact
              path='/create-profile'
              component={CreateProfile}
            />
            <PrivateRoute exact path='/edit-profile' component={EditProfile} />
            <PrivateRoute
              exact
              path='/add-experience'
              component={AddExperience}
            />
            <PrivateRoute
              exact
              path='/add-education'
              component={AddEducation}
            />
          </section>
        </Fragment>
      </Router>
    </Provider>
  );
};

export default App;
