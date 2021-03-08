import Cookies from 'js-cookie';

import { LOGIN, LOGIN_ERROR, SIGNUP, SIGNUP_ERROR, LOGOUT } from './actions';

// check if there are credentials in the browser's cookies
const authToken = Cookies.get('Auth-Token');
const isLoggedIn = authToken !== undefined;

const initialState = { isLoggedIn };

export default function loginReducer(state = initialState, action) {
    switch (action.type) {
        case LOGIN:
            state = { isLoggedIn: true };
            break;
        case LOGIN_ERROR:
            state = { isLoggedIn: false, loginError: action.error };
            break;
        case SIGNUP:
            state = { isLoggedIn: true };
            break;
        case SIGNUP_ERROR:
            state = { isLoggedIn: false, signupError: action.error };
            break;
        case LOGOUT:
            state = { isLoggedIn: false };
            break;
        default:
            break;
    }

    return state;
}