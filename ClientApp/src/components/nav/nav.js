import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import withRouter from '../withRouter/withRouter';

import { Navbar, Nav, NavDropdown, Button } from 'react-bootstrap';

import { logout } from '../../pages/auth/redux/actions';
import { useDispatch, useSelector } from 'react-redux';

import LogoLight from './images/logo-light.png';
import LogoDark from './images/logo-dark.png';
import ShoppingCartLight from './images/shopping-cart-light.png';
import ShoppingCartDark from './images/shopping-cart-dark.png';
import ProfileLight from './images/profile-light.png';
import ProfileDark from './images/profile-dark.png';

function Navigation() {

    const location = useLocation();
    const { pathname, search } = location;

    // the user's auth state
    const userAuthState = useSelector(store => store.auth);
    // the user's cart state
    const cartState = useSelector(store => store.cart);

    const dispatch = useDispatch();

    // checks whether the navbar is expanded or not on small screens
    const [navExpanded, setNavExpanded] = useState(false);
    // the theme of the navbar
    const [navbarLight, setNavbarLight] = useState(false);

    useEffect(() => {
        // change the navbar based on the screen size
        sizeListener();
        // create a resize listener to show the correct navbar when the screen is resized
        window.addEventListener('resize', sizeListener);

        // remove the listener when the component is removed
        return () => {
            window.removeEventListener('scroll', scrollListener);
            window.removeEventListener('resize', sizeListener);
        }
    }, [pathname]);

    /**
     * changes the navbar based on the screen size
     */
    const sizeListener = () => {
        const navbar = document.querySelector('.nav-container');
        // check if the window's window is larger than 573
        if (window.innerWidth > 573) {
            window.addEventListener('scroll', scrollListener);

            // check if the user is currently on the homepage
            if (pathname === '/') {
                // remove the nav element's white background, and make its position absolute
                setNavbarLight(false);
                navbar.classList.add('absolute');
            } else {
                // make the nav element's background white and remove the absolute positioning
                setNavbarLight(true);
                navbar.classList.remove('absolute');
            }
        } else {
            // otherwise remove the navbar's white background, absolute positioning, and scroll listener
            setNavbarLight(false);
            navbar.classList.remove('absolute');
            window.removeEventListener('scroll', scrollListener);
        }
    }

    /**
     * changes the navbar based on the user's scroll value
     */
    const scrollListener = () => {
        // check if the window's window is larger than 573
        if (window.innerWidth > 573) {
            // make the navbar's background white
            setNavbarLight(true);

            const navbar = document.querySelector('.nav-container');
            // check if the navbar is no longer visible on the screen
            if (window.scrollY > navbar.clientHeight) {
                // make its position fixed if it's not already
                if (!navbar.classList.contains('fixed')) {
                    navbar.classList.add('fixed');
                }
            } else {
                // otherwise remove the white background if the user is on the homepage 
                if (pathname === '/') {
                    setNavbarLight(false);
                }

                // remove the fixed positioning
                navbar.classList.remove('fixed');
            }
        }
    }

    /**
     * returns the nav links
     */
    const getNavItems = () => {
        // title and path of each link
        const links = [
            { title: 'Men', path: '/products?category=men' },
            { title: 'Women', path: '/products?category=women' },
            { title: 'Kids', path: '/products?category=kids' },
            { title: 'Collection', path: '/products' }
        ];

        const linksList = [];

        // get the current url
        const urlPath = `${pathname}${search}`;

        for (const link of links) {
            linksList.push(
                <Nav.Link
                    as={Link}
                    to={link.path}
                    // highlight the current title if the current url is equal to its path
                    className={urlPath === link.path ? 'active' : ''}
                    // collapse the navbar when the link is clicked
                    onClick={() => setNavExpanded(false)}
                    key={`nav-link-${link.title}`}>
                    {link.title}
                </Nav.Link>
            );
        }

        return linksList;
    }

    return (
        <div className='nav-container w-100'>
            <Navbar
                className='px-2'
                collapseOnSelect
                onToggle={() => setNavExpanded(!navExpanded)}
                expand="sm"
                expanded={navExpanded}
                variant={navbarLight ? 'light' : 'dark'}>

                {/* hamburger menu */}
                <Navbar.Toggle aria-controls="responsive-navbar-nav">
                    <span>
                        <div className='bar'></div>
                        <div className='bar'></div>
                        <div className='bar'></div>
                    </span>
                </Navbar.Toggle>

                {/* display the overlay behind the nav drawer if the navbar is expanded on small screens */}
                {navExpanded &&
                    <div className='overlay' onClick={() => setNavExpanded(false)}></div>
                }

                {/* website's logo */}
                <Navbar.Brand as={Link} to="/" className='mx-auto'>
                    {
                        /* display either the light or dark logo based on the navbar's background color*/
                        navbarLight ?
                            <img src={LogoDark} alt='logo' className='logo' />
                            :
                            <img src={LogoLight} alt='logo' className='logo' />
                    }
                </Navbar.Brand>

                {/* nav links */}
                <Navbar.Collapse>
                    <Nav variant='dark' className='mx-auto'>
                        {getNavItems()}
                    </Nav>
                </Navbar.Collapse>

                {/* shopping cart, and user account links */}
                <div className='d-flex'>
                    <Nav.Link as={Link} to='/cart' className='navlink-cart'>
                        {
                            /* display either the light or dark cart image based on the navbar's background color*/
                            navbarLight ?
                                <img src={ShoppingCartDark} alt='cart' />
                                :
                                <img src={ShoppingCartLight} alt='cart' />
                        }
                        <span>{cartState.length <= 99 ? cartState.length : '99+'}</span>
                    </Nav.Link>

                    {
                        /* add adropdown menu under the profile image if the user is logged in */
                        userAuthState.isLoggedIn ?
                            /* display either the light or dark logo based on the navbar's background color*/
                            <NavDropdown title={
                                navbarLight ?
                                    <img src={ProfileDark} alt='user' />
                                    :
                                    <img src={ProfileLight} alt='user' />
                            }>
                                <NavDropdown.Item as={Link} to='/orders'>
                                    Orders
                                </NavDropdown.Item>

                                <NavDropdown.Item className='rounded-0' as={Button} onClick={() => dispatch(logout())}>
                                    Logout
                                </NavDropdown.Item>
                            </NavDropdown>

                            :

                            /* otherwise treat the profile image as a link to the auth page */
                            <Nav.Link as={Link} to='/auth'>
                                {
                                    /* display either the light or dark logo based on the navbar's background color*/
                                    navbarLight ?
                                        <img src={ProfileDark} alt='user' />
                                        :
                                        <img src={ProfileLight} alt='user' />
                                }
                            </Nav.Link>

                    }
                </div>
            </Navbar>
        </div>
    );
}

export default withRouter(Navigation);