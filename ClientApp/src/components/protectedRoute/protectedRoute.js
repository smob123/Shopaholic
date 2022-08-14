/**
 * wraps routes that can only accessed by users, who are logged in
 */

import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

export default function ProtectedRoute({ element }) {
    const userAuthState = useSelector(store => store.auth);

    if (userAuthState.isLoggedIn) {
        return element;
    }

    return <Navigate to='/auth' />
}