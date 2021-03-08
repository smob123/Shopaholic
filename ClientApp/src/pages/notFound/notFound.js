/**
 * 404 page
 */

import { Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';

export default function NotFound() {
    return (
        <main className='not-found-container pt-5 text-center'>
            <h1 className='red-text mb-4'>404</h1>

            <h3>OPPS! PAGE NOT BE FOUND</h3>

            <p>
                Sorry but the page you are looking for does not exist, have been
                removed, name changed or is temporarily unavailable.
            </p>

            <Button
                className='px-5 py-2'
                variant='danger'
                as={Link}
                to='/'>
                Back to Homepage
            </Button>
        </main>
    );
}