import React, { Component } from 'react';
import './Header.css';
import { withStyles } from '@material-ui/core/styles';
import FastFoodIcon from '@material-ui/icons/Fastfood'
import Input from '@material-ui/core/Input';
import InputAdornment from '@material-ui/core/InputAdornment';
import SearchIcon from '@material-ui/icons/Search';
import Button from '@material-ui/core/Button';
import AccountCircleIcon from '@material-ui/icons/AccountCircle'
import Modal from 'react-modal';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import PropTypes from 'prop-types';
import FormHelperText from '@material-ui/core/FormHelperText';
import Snackbar from '@material-ui/core/Snackbar';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import { Link } from 'react-router-dom';

/*  Login Modal Style */
const loginModalStyle = {
    content: {
        top: '50%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)'
    }
};

/* Style for underline of the search box when clicked */
const styles = theme => ({
    searchUnderline: {
        '&:after': {
            borderBottomColor: 'white',
        },
    },
});
/* Tab Style */
const TabContainer = function (props) {
    return (
        <Typography component='div' style={{ padding: 0, textAlign: 'center' }}>
            {props.children}
        </Typography>
    )
}

TabContainer.propTypes = {
    children: PropTypes.node.isRequired
}

class Header extends Component {
    constructor(props) {
        super(props);
        this.baseUrl = 'http://localhost:8080/api/';
        this.state = {
            modalIsOpen: false,
            value: 0,
            loginContactNoRequired: 'dspNone',
            loginContactNoRequiredMsg: 'required',
            loginContactNo: '',
            loginPasswordRequired: 'dspNone',
            loginPasswordRequiredMsg: 'required',
            loginPassword: '',
            firstNameRequired: 'dspNone',
            firstName: '',
            lastName: '',
            emailRequired: 'dspNone',
            emailRequiredMsg: 'required',
            email: '',
            signupPasswordRequired: 'dspNone',
            signupPasswordRequiredMsg: 'required',
            signupPassword: '',
            signupContactNoRequired: 'dspNone',
            signupContactNoRequiredMsg: 'required',
            signupContactNo: '',
            signupSuccess: false,
            loggedIn: sessionStorage.getItem('access-token') == null ? false : true,
            userFirstName: '',
            openLoginSuccessMsg: false,
            openSignupSuccessMsg: false,
            anchorEl: null
        }
    }

    openLoginModalHandler = () => {
        this.setState({
            modalIsOpen: true,
            value: 0,
            loginContactNoRequired: 'dspNone',
            loginContactNoRequiredMsg: 'required',
            loginContactNo: '',
            loginPasswordRequired: 'dspNone',
            loginPasswordRequiredMsg: 'required',
            loginPassword: '',
            firstNameRequired: 'dspNone',
            firstName: '',
            lastName: '',
            emailRequired: 'dspNone',
            emailRequiredMsg: 'required',
            email: '',
            signupPasswordRequired: 'dspNone',
            signupPasswordRequiredMsg: 'required',
            signupPassword: '',
            signupContactNoRequired: 'dspNone',
            signupContactNoRequiredMsg: 'required',
            signupContactNo: '',
        });
    }

    closeLoginModalHandler = () => {
        this.setState({ modalIsOpen: false });
    }

    loginModalTabChangeHandler = (event, value) => {
        this.setState({ value });
    }

    inputLoginContactNoChangeHandler = (event) => {
        this.setState({ loginContactNo: event.target.value });
    }

    inputLoginPasswordChangeHandler = (event) => {
        this.setState({ loginPassword: event.target.value });
    }
/** Login Click Handler */
    loginClickHandler = () => {
        let contactReq = false;
        if (this.state.loginContactNo === '') {
            this.setState({
                loginContactNoRequired: 'dspBlock',
                loginContactNoRequiredMsg: 'required'
            });
            contactReq = true;
        } else {
            this.setState({ loginContactNoRequired: 'dspNone' });
        }

        let passwordReq = false;
        if (this.state.loginPassword === '') {
            this.setState({
                loginPasswordRequired: 'dspBlock',
                loginPasswordRequiredMsg: 'required'
            });
            passwordReq = true;
        } else {
            this.setState({ loginPasswordRequired: 'dspNone' });
        }

        let validateContact = new RegExp('^[0][1-9]{9}$|^[1-9]{9}');
        if (contactReq === false && validateContact.test(this.state.loginContactNo) === false) {
            this.setState({
                loginContactNoRequired: 'dspBlock',
                loginContactNoRequiredMsg: 'Invalid Contact',
            });
            return;
        }

        if (contactReq || passwordReq) {
            return;
        }

        let dataLogin = null;
        let xhrLogin = new XMLHttpRequest();
        let _this = this;
        xhrLogin.addEventListener('readystatechange', function () {
            if (this.readyState === 4) {
                let responseText = JSON.parse(this.responseText);
                if (responseText.code === 'ATH-001' || responseText.code === 'ATH-002') {
                    _this.setState({
                        loginPasswordRequired: 'dspBlock',
                        loginPasswordRequiredMsg: responseText.message,
                    });
                    return;
                }

                sessionStorage.setItem('user-uuid', responseText.id);
                sessionStorage.setItem('access-token', xhrLogin.getResponseHeader('access-token'));
                sessionStorage.setItem('user-first-name', responseText.first_name);

                _this.setState({
                    loggedIn: true,
                    userFirstName: responseText.first_name,
                    openLoginSuccessMsg: true,
                });

                _this.closeLoginModalHandler();
            }
        });
        xhrLogin.open('POST', this.baseUrl + 'customer/login');
        xhrLogin.setRequestHeader('authorization', 'Basic ' + window.btoa(this.state.loginContactNo + ':' + this.state.loginPassword));
        xhrLogin.setRequestHeader('Content-Type', 'application/json');
        xhrLogin.send(dataLogin);
    }

    inputFirstNameChangeHandler = (event) => {
        this.setState({ firstName: event.target.value });
    }

    inputLastNameChangeHandler = (event) => {
        this.setState({ lastName: event.target.value });
    }

    inputEmailChangeHandler = (event) => {
        this.setState({ email: event.target.value });
    }

    inputSignupPasswordChangeHandler = (event) => {
        this.setState({ signupPassword: event.target.value });
    }

    inputSignupContactNoChangeHandler = (event) => {
        this.setState({ signupContactNo: event.target.value });
    }
    /** Signup Handler */
    singupClickHandler = () => {
        let firstNameReq = false
        if (this.state.firstName === '') {
            this.setState({ firstNameRequired: 'dspBlock' });
            firstNameReq = true;
        } else {
            this.setState({ firstNameRequired: 'dspNone' });
        }

        let emailReq = false;
        if (this.state.email === '') {
            this.setState({
                emailRequired: 'dspBlock',
                emailRequiredMsg: 'required'
            });
            emailReq = true;
        } else {
            this.setState({ emailRequired: 'dspNone' });
        }

        let passwordReq = false;
        if (this.state.signupPassword === '') {
            this.setState({
                signupPasswordRequired: 'dspBlock',
                signupPasswordRequiredMsg: 'required'
            });
            passwordReq = true;
        } else {
            this.setState({ signupPasswordRequired: 'dspNone' });
        }

        let contactNoReq = false;
        if (this.state.signupContactNo === '') {
            this.setState({
                signupContactNoRequired: 'dspBlock',
                signupContactNoRequiredMsg: 'required'
            })
            contactNoReq = true;
        } else {
            this.setState({ signupContactNoRequired: 'dspNone' });
        }

        let validateEmail = new RegExp('^[a-zA-Z0-9_+&*-]+(?:.[a-zA-Z0-9_+&*-]+)*@(?:[a-zA-Z0-9-]+.)+[a-zA-Z]{2,7}');
        if (emailReq === false && validateEmail.test(this.state.email) === false) {
            this.setState({
                emailRequired: 'dspBlock',
                emailRequiredMsg: 'Invalid Email'
            });
            return;
        }

        let validatePassword = new RegExp('^(?=.*?[A-Z])(?=.*?[0-9])(?=.*?[#@$%&*!^-]).{8,}$');
        if (passwordReq === false && validatePassword.test(this.state.signupPassword) === false) {
            this.setState({
                signupPasswordRequired: 'dspBlock',
                signupPasswordRequiredMsg: 'Password must contain at least one capital letter, one small letter, one number, and one special character'
            });
            return;
        }

        let validateContact = new RegExp('^[0][1-9]{9}$|^[1-9]{9}');
        if (contactNoReq === false && validateContact.test(this.state.signupContactNo) === false) {
            this.setState({
                signupContactNoRequired: 'dspBlock',
                signupContactNoRequiredMsg: 'Contact No. must contain only numbers and must be 10 digits long'
            });
            return;
        }

        if (firstNameReq || emailReq || passwordReq || contactNoReq) {
            return;
        }

        let dataSignup = {
            'first_name': this.state.firstName,
            'last_name': this.state.lastName,
            'email_address': this.state.email,
            'password': this.state.signupPassword,
            'contact_number': this.state.signupContactNo,
        };
        let xhrSignup = new XMLHttpRequest();
        let that = this;
        xhrSignup.addEventListener('readystatechange', function () {
            if (this.readyState === 4) {
                let responseText = JSON.parse(this.responseText);
                if (responseText.code === 'SGR-001') {
                    that.setState({
                        signupContactNoRequired: 'dspBlock',
                        signupContactNoRequiredMsg: responseText.message
                    });
                    return;
                }

                that.setState({
                    value: 0,
                    openSignupSuccessMsg: true,
                });
            }
        })
        xhrSignup.open('POST', this.baseUrl + 'customer/signup');
        xhrSignup.setRequestHeader('Content-Type', 'application/json');
        xhrSignup.send(JSON.stringify(dataSignup));
    }

    loginSuccessMsgOnCloseHandler = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }

        this.setState({ openLoginSuccessMsg: false });
    }

    signupSuccessMsgOnCloseHandler = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }

        this.setState({ openSignupSuccessMsg: false });
    }

    userMenuOnClickHandler = event => {
        this.setState({ anchorEl: event.currentTarget });
    }

    userMenuOnCloseHandler = () => {
        this.setState({ anchorEl: null });
    }

    myProfileOnClickHandler = () => {
        this.setState({ anchorEl: null });
    }
    /** Remove the session data on logout */
    logoutOnClickHandler = () => {
        let xhrPosts = new XMLHttpRequest();
        let _this = this;
        xhrPosts.addEventListener("readystatechange", function () {
            if (this.readyState === 4) {
                var data = JSON.parse(this.responseText)
                console.log(data);
                if (this.status === 200) {
                    sessionStorage.removeItem('access-token');
                    sessionStorage.removeItem('user-uuid');
                    _this.setState({
                        anchorEl: null,
                        loggedIn: false
                    });
                   
                }
                else if (this.status === 401) {
                    _this.setState({
                        loginErrorMsg: data.message
                    })
                }

            }
        });
        xhrPosts.open("POST", _this.baseUrl +'customer/logout');
        xhrPosts.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');
        xhrPosts.setRequestHeader('authorization', "Bearer " + sessionStorage.getItem('access-token'));
        xhrPosts.send();
    }


    render() {
        const { classes } = this.props;
        const { anchorEl } = this.state;
        return (
            <div>
                <header className='app-header'>
                    {/* header app logo */}
                    <div className='app-logo'>
                        <FastFoodIcon id='fast-food-icon' fontSize='large' />
                    </div>
                    {/* header search box */}
                    {this.props.showSearchBox ?
                        <div className='search-box'>
                            <Input
                                id='search-box-input'
                                classes={{
                                    underline: classes.searchUnderline,
                                }}
                                type='text'
                                placeholder='Search by Restaurant Name'
                                startAdornment={
                                    <InputAdornment position='start'>
                                        <SearchIcon id='search-box-icon' />
                                    </InputAdornment>
                                }
                                onChange={this.props.searchHandler}
                            />
                        </div>
                        : ''
                    }

                    {/* header app login */}
                    {!this.state.loggedIn ?
                        <div className={this.props.showSearchBox ? 'app-login-1' : 'app-login-2'}>
                            <Button
                                size='medium'
                                variant='contained'
                                color='default'
                                onClick={this.openLoginModalHandler}
                            >
                                <AccountCircleIcon id='login-btn-icon' />
                                LOGIN
                                </Button>
                        </div>
                        :
                        <div className={this.props.showSearchBox ? 'app-login-1' : 'app-login-2'}>
                            <Button
                                id='user-btn'
                                size='medium'
                                aria-owns={anchorEl ? 'simple-menu' : undefined}
                                aria-haspopup='true'
                                onClick={this.userMenuOnClickHandler}
                            >
                                <AccountCircleIcon id='user-btn-icon' />
                                {sessionStorage.getItem('user-first-name')}
                            </Button>
                            <Menu
                                id='user-menu'
                                anchorEl={anchorEl}
                                open={Boolean(anchorEl)}
                                onClose={this.userMenuOnCloseHandler}
                            >
                                <MenuItem onClick={this.myProfileOnClickHandler}>
                                    <Link to='/profile' style={{ textDecoration: 'none' }}>
                                        My Profile
                                        </Link>
                                </MenuItem>
                                <MenuItem onClick={this.logoutOnClickHandler}>                                
                                        Logout
                                </MenuItem>
                            </Menu>
                        </div>
                    }
                </header>
                {/* login and signup modal */}
                <Modal
                    ariaHideApp={false}
                    isOpen={this.state.modalIsOpen}
                    contentLabel='Login'
                    onRequestClose={this.closeLoginModalHandler}
                    style={loginModalStyle}
                >
                    <Tabs className='login-signup-tabs' value={this.state.value} onChange={this.loginModalTabChangeHandler}>
                        <Tab label='LOGIN' />
                        <Tab label='SIGNUP' />
                    </Tabs>
                    {/* login tab container */}
                    {this.state.value === 0 &&
                        <TabContainer>
                            {/* login contanct no */}
                            <FormControl required>
                                <InputLabel htmlFor='loginContactNo'>Contact No.</InputLabel>
                                <Input
                                    id='loginContactNo'
                                    type='text'
                                    logincontactno={this.state.loginContactNo}
                                    value={this.state.loginContactNo}
                                    onChange={this.inputLoginContactNoChangeHandler}
                                />
                                <FormHelperText className={this.state.loginContactNoRequired} error={true}>
                                    <span>{this.state.loginContactNoRequiredMsg}</span>
                                </FormHelperText>
                            </FormControl>
                            <br /><br />
                            {/* login password */}
                            <form>
                                <FormControl required>
                                    <InputLabel htmlFor='loginPassword'>Password</InputLabel>
                                    <Input
                                        id='loginPassword'
                                        type='password'
                                        loginpassword={this.state.loginPassword}
                                        value={this.state.loginPassword}
                                        onChange={this.inputLoginPasswordChangeHandler}
                                        autoComplete='off'
                                    />
                                    <FormHelperText className={this.state.loginPasswordRequired} error={true}>
                                        <span className='errorMessage'>{this.state.loginPasswordRequiredMsg}</span>
                                    </FormHelperText>
                                </FormControl>
                            </form>
                            <br /><br />
                            <Button id='modal-login-btn' variant='contained' color='primary' onClick={this.loginClickHandler}>LOGIN</Button>
                        </TabContainer>
                    }
                    {/* signup tab container */}
                    {this.state.value === 1 &&
                        <TabContainer>
                            {/* signup first name */}
                            <FormControl required>
                                <InputLabel htmlFor='firstName'>First Name</InputLabel>
                                <Input
                                    id='firstName'
                                    type='text'
                                    firstname={this.state.firstName}
                                    value={this.state.firstName}
                                    onChange={this.inputFirstNameChangeHandler}
                                />
                                <FormHelperText className={this.state.firstNameRequired} error={true}>
                                    <span>required</span>
                                </FormHelperText>
                            </FormControl>
                            <br /><br />
                            {/* signup last name */}
                            <FormControl>
                                <InputLabel htmlFor='lastName'>Last Name</InputLabel>
                                <Input
                                    id='lastName'
                                    type='text'
                                    lastname={this.state.lastName}
                                    value={this.state.lastName}
                                    onChange={this.inputLastNameChangeHandler}
                                />
                            </FormControl>
                            <br /><br />
                            {/* signup email */}
                            <FormControl required>
                                <InputLabel htmlFor='email'>Email</InputLabel>
                                <Input
                                    id='email'
                                    type='text'
                                    email={this.state.email}
                                    value={this.state.email}
                                    onChange={this.inputEmailChangeHandler}
                                />
                                <FormHelperText className={this.state.emailRequired} error={true}>
                                    <span>{this.state.emailRequiredMsg}</span>
                                </FormHelperText>
                            </FormControl>
                            <br /><br />
                            {/* signup password */}
                            <form>
                                <FormControl required>
                                    <InputLabel htmlFor='signupPassword'>Password</InputLabel>
                                    <Input
                                        id='signupPassword'
                                        type='password'
                                        signuppassword={this.state.signupPassword}
                                        value={this.state.signupPassword}
                                        onChange={this.inputSignupPasswordChangeHandler}
                                        autoComplete='off'
                                    />
                                    <FormHelperText className={this.state.signupPasswordRequired} error={true}>
                                        <span>{this.state.signupPasswordRequiredMsg}</span>
                                    </FormHelperText>
                                </FormControl>
                            </form>
                            <br />
                            {/* signup contact no */}
                            <FormControl required>
                                <InputLabel htmlFor='signupContactNo'>Contact No</InputLabel>
                                <Input
                                    id='signupContactNo'
                                    type='text'
                                    signupcontactno={this.state.signupContactNo}
                                    value={this.state.signupContactNo}
                                    onChange={this.inputSignupContactNoChangeHandler}
                                />
                                <FormHelperText className={this.state.signupContactNoRequired} error={true}>
                                    <span>{this.state.signupContactNoRequiredMsg}</span>
                                </FormHelperText>
                            </FormControl>
                            <br /><br />
                            <Button id='modal-signup-btn' variant='contained' color='primary' onClick={this.singupClickHandler}>SIGNUP</Button>
                        </TabContainer>
                    }
                </Modal>
                {/* login snackbar */}
                <Snackbar
                    anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'left',
                    }}
                    open={this.state.openLoginSuccessMsg}
                    autoHideDuration={5000}
                    onClose={this.loginSuccessMsgOnCloseHandler}
                    ContentProps={{
                        'aria-describedby': 'message-id',
                    }}
                    message={<span id='message-id'>Logged in successfully!</span>}
                />
                {/* signup snackbar */}
                <Snackbar
                    anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'left',
                    }}
                    open={this.state.openSignupSuccessMsg}
                    autoHideDuration={5000}
                    onClose={this.signupSuccessMsgOnCloseHandler}
                    ContentProps={{
                        'aria-describedby': 'message-id',
                    }}
                    message={<span id='message-id'>Registered successfully! Please login now!</span>}
                />
            </div>
        )
    }
}
export default withStyles(styles)(Header);
