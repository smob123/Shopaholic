import { useEffect, useState } from 'react';
import { Card, Tabs, Tab, Form, Button } from 'react-bootstrap';

import { useDispatch, useSelector } from 'react-redux';
import { login, signup } from './redux/actions';

export default function Auth({ history }) {
    // user's auth state
    const userAuthState = useSelector(store => store.auth);

    // redirect the user to the homepage if they're already logged in
    if (userAuthState.isLoggedIn) {
        history.push('/');
    }

    // login form data
    const [loginEmail, setLoginEmail] = useState('');
    const [loginPassword, setLoginPassword] = useState('');
    const [loginErrorMessage, setLoginErrorMessage] = useState('');

    // sign up form data
    const [signupFirstName, setSignupFirstName] = useState('');
    const [signupLastName, setSignupLastName] = useState('');
    const [signupEmail, setSignupEmail] = useState('');
    const [signupPassword, setSignupPassword] = useState('');
    const [signupErrorMessage, setSignupErrorMessage] = useState('');

    // checks if waiting for a response from the server
    const [isLoading, setIsLoading] = useState(false);

    const dispatch = useDispatch();

    useEffect(() => {
        setIsLoading(false);
    }, [loginErrorMessage, signupErrorMessage, userAuthState.loginError, userAuthState.signupError]);

    /**
     * verifies login form input and sends it to the server
     */
    const handleLogin = () => {
        setIsLoading(true);
        const requiredParams = [loginEmail, loginPassword];

        // make sure that none of the parameters is empty
        for (const param of requiredParams) {
            if (param.trim() === '') {
                // display an error message
                setLoginErrorMessage('Please fill in the empty feilds');
                return;
            }
        }

        // hide the error message
        setLoginErrorMessage('');
        // send a login request
        dispatch(login(loginEmail, loginPassword));
    }

    /**
     * verifies sign up form input and sends it to the server
     */
    const handleSignup = () => {
        setIsLoading(true);

        const requiredParams = [signupFirstName, signupLastName, signupEmail, signupPassword];

        // make sure that none of the parameters is empty
        for (const param of requiredParams) {
            if (param.trim() === '') {
                // display an error message
                setSignupErrorMessage('Please fill in the empty feilds');
                return;
            }
        }

        // hide the error message
        setSignupErrorMessage('');
        // send a sign up request
        dispatch(signup(signupFirstName, signupLastName, signupEmail, signupPassword));
    }

    return (
        <main className='auth-page'>
            <div className='container pt-5 pb-5'>
                <Card className='shadow-sm pb-5 m-auto'>
                    <Card.Body>
                        <Tabs defaultActiveKey='login'>
                            {/* login tab */}
                            <Tab eventKey='login' title='Login'>
                                <Card.Title className='text-center mt-5'>
                                    <strong>
                                        Login to your account
                                    </strong>
                                </Card.Title>

                                <Form className='mt-4' onSubmit={(e) => e.preventDefault()}>
                                    <Form.Group className='mb-4' controlId="formLoginEmail">
                                        <Form.Label>Email address</Form.Label>
                                        <Form.Control required className='py-2' type="email" placeholder="Enter email" onChange={e => setLoginEmail(e.target.value)} />
                                    </Form.Group>

                                    <Form.Group controlId="formLoginPassword">
                                        <Form.Label>Password</Form.Label>
                                        <Form.Control required className='py-2' type="password" placeholder="Enter password" onChange={e => setLoginPassword(e.target.value)} />
                                    </Form.Group>

                                    {/* error messages */}
                                    <p className='red-text'>{loginErrorMessage}</p>
                                    <p className='red-text'>{userAuthState.loginError}</p>

                                    <Button
                                        disabled={isLoading}
                                        variant="danger"
                                        type="submit"
                                        size='lg'
                                        onClick={() => handleLogin()}>
                                        Submit
                                    </Button>
                                </Form>
                            </Tab>

                            {/* sign up tab */}
                            <Tab eventKey='signup' title='Sign up'>
                                <Card.Title className='text-center mt-5'>
                                    <strong>
                                        Create a new account
                                    </strong>
                                </Card.Title>

                                <Form className='mt-4' onSubmit={(e) => e.preventDefault()}>
                                    <Form.Group className='mb-4' controlId="formFirstName">
                                        <Form.Label>First Name</Form.Label>
                                        <Form.Control required className='py-2' placeholder="Enter your first name" onChange={e => setSignupFirstName(e.target.value)} />
                                    </Form.Group>

                                    <Form.Group className='mb-4' controlId="formLastName">
                                        <Form.Label>Last Name</Form.Label>
                                        <Form.Control required className='py-2' placeholder="Enter your last name" onChange={e => setSignupLastName(e.target.value)} />
                                    </Form.Group>

                                    <Form.Group className='mb-4' controlId="formSignupEmail">
                                        <Form.Label>Email address</Form.Label>
                                        <Form.Control required className='py-2' type="email" placeholder="Enter email" onChange={e => setSignupEmail(e.target.value)} />
                                    </Form.Group>

                                    <Form.Group className='mb-4' controlId="formSignupPassword">
                                        <Form.Label>Password</Form.Label>
                                        <Form.Control required className='py-2' type="password" placeholder="Enter password" onChange={e => setSignupPassword(e.target.value)} />
                                    </Form.Group>

                                    {/* error messages */}
                                    <p className='red-text'>{signupErrorMessage}</p>
                                    <p className='red-text'>{userAuthState.signupError}</p>

                                    <Button
                                        disabled={isLoading}
                                        variant="danger"
                                        type="submit"
                                        size='lg'
                                        onClick={(e) => handleSignup(e)}>
                                        Submit
                                    </Button>
                                </Form>
                            </Tab>
                        </Tabs>
                    </Card.Body>
                </Card>
            </div>
        </main>
    );
}