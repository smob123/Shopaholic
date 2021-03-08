import AuthModel from '../authModel';
import { addNotification } from '../../../components/notification/redux/actions';

export const LOGIN = 'LOGIN';

export const LOGIN_ERROR = 'LOGIN_ERROR';

export const SIGNUP = 'SIGNUP';

export const SIGNUP_ERROR = 'SIGNUP_ERROR';

export const LOGOUT = 'LOGOUT';

export function login(email, password) {
    return async (dispatch) => {
        const res = await AuthModel.login(email, password);
        if (res.status === 200) {
            dispatch({ type: LOGIN });
        } else {
            dispatch({ type: LOGIN_ERROR, error: res.message });
        }
    }
}

export function signup(firstName, lastName, email, password) {
    return async (dispatch) => {
        const res = await AuthModel.signup(firstName, lastName, email, password);
        if (res.status === 200) {
            dispatch({ type: SIGNUP });
        } else {
            dispatch({ type: SIGNUP_ERROR, error: res.message });
        }
    }
}

export function logout() {
    return async (dispatch) => {
        const res = await AuthModel.logout();
        if (res.status === 200) {
            dispatch({ type: LOGOUT });
        } else {
            dispatch(addNotification({ type: 'Error', message: 'Failed to logout' }));
        }
    }
}