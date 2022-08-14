/**
 * scrolls to the top of the page, when the user navigates between pages
 */

import { useEffect } from 'react';
import withRouter from '../withRouter/withRouter';
import { useLocation } from "react-router-dom";

function ScrollToTop(props) {

    const { pathname } = useLocation();

    useEffect(() => {
        window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    }, [pathname]);

    return props.children;
}

export default withRouter(ScrollToTop);