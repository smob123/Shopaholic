/**
 * wraps routes that can only accessed by users, who are logged in
 */

import { Route, Redirect } from 'react-router-dom';
import { useSelector } from 'react-redux';

export default function ProtectedRoute({ path, route, component, exact }) {
    const userAuthState = useSelector(store => store.auth);

    if (userAuthState.isLoggedIn) {
        return <Route path={path} route={route} component={component} exact={exact} />
    }

    return <Redirect to='/auth' />
}