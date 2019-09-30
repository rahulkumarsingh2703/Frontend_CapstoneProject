import React, { Component } from 'react';
import Home from './home/Home';
import Details from './details/Details';
import Checkout from './checkout/Checkout';
import { Route, Redirect, Switch } from 'react-router-dom';
import Profile from './profile/Profile';

class Controller extends Component {

    constructor() {
        super();
        this.baseUrl = 'http://localhost:8080/api/';
    }

    render() {
        return (
                <Switch>
                    <Route exact path='/' render={({history},props) => <Home {...props} baseUrl={this.baseUrl} history={history} />} />
                    <Route path='/restaurant/:id' render={({history},props) => <Details {...props} baseUrl={this.baseUrl} history={history} />} />
                    {/* Redirection to home page if a customer tries to go to the checkout page directly
                */}
                    <Route path='/checkout' render={({history},props) => (
                        sessionStorage.getItem('access-token') === null ? (
                            <Redirect to='/' />
                        ) : (
                                <Checkout {...props} baseUrl={this.baseUrl} history={history} />
                            )
                    )} />
                    <Route path='/profile' render={({history},props) => <Profile {...props} baseUrl={this.baseUrl} history={history} />} />
                </Switch>
        )
    }
}

export default Controller;