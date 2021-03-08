import { createStore, combineReducers, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import authReducer from '../pages/auth/redux/reducer';
import cartReducer from '../pages/productDetails/redux/reducer';
import notificationReducer from '../components/notification/redux/reducers';

const rootReducer = combineReducers({
    auth: authReducer,
    cart: cartReducer,
    notifications: notificationReducer
});

// apply the thunk middleware to allow reducers to make network requests
export default createStore(rootReducer, applyMiddleware(thunk));