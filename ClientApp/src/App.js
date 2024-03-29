import { useEffect, Fragment } from 'react';
import { BrowserRouter as Router, Navigate, Route, Routes } from 'react-router-dom';
import ProtectedRoute from './components/protectedRoute/protectedRoute';

import ScrollToTop from './components/scrollToTop/scrollToTop';
import Nav from './components/nav/nav';
import Footer from './components/footer/footer';
import Home from './pages/home/home';
import ProductDetails from './pages/productDetails/productDetails';
import ProductListing from './pages/productListing/productListing';
import Auth from './pages/auth/auth';
import Cart from './pages/cart/cart';
import Checkout from './pages/checkout/checkout';
import Orders from './pages/orders/orders';
import NotFound from './pages/notFound/notFound';

import Notification from './components/notification/notification';

import { useDispatch, useSelector } from 'react-redux';
import { getCart, resetCart } from './pages/productDetails/redux/actions';

import './App.scss';

function App() {

    // get user's auth state
    const userAuthState = useSelector(store => store.auth);
    // get user's notifications
    const notifications = useSelector(store => store.notifications);

    const dispatch = useDispatch();

    useEffect(() => {
        // fetch the user's cart when they are logged in
        if (userAuthState.isLoggedIn) {
            dispatch(getCart());
        } else {
            dispatch(resetCart());
        }
    }, [userAuthState.isLoggedIn]);

    /**
     * returns the user's notifications
    */
    const getNotifications = () => {
        const notificationList = [];

        for (const notification of notifications) {
            notificationList.push(
                <Notification key={`${Date.now()}_${notification.type}_${notification.message}`}
                    type={notification.type}
                    message={notification.message} />
            );
        }

        return notificationList;
    }

    return (
        <Fragment>
            <div className='notifications-container'>
                {getNotifications()}
            </div>

            <Router>
                <ScrollToTop>
                    <Nav />

                    <Routes>
                        <Route exact path='*' element={<NotFound />} />
                        <Route exact path='/' element={<Home />} />
                        <Route exact path='/product/:id' element={<ProductDetails />} />
                        <Route path='/products' element={<ProductListing />} />
                        <Route exact path='/auth' element={<Auth />} />
                        <Route path='/cart' element={<ProtectedRoute element={<Cart />} />} />
                        <Route path='/checkout' element={<ProtectedRoute element={<Checkout />} />} />
                        <Route path='/orders' element={<ProtectedRoute element={<Orders />} />} />
                    </Routes>

                    <Footer />
                </ScrollToTop>
            </Router>
        </Fragment>
    );
}

export default App;
