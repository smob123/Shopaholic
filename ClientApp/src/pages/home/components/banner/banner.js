/**
 * bottom ad banner.
 */

import { Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';

import Background from '../../images/banner.jpg';

export default function Banner() {
    return (
        <div className='banner-container position-relative'>

            <Link to='/products'>
                <img src={Background} alt='banner' />
            </Link>

            <div>
                <h3 className='red-text'>Spring Collection</h3>
                <h2>Up to 50% off</h2>
                <p className='mt-1 mt-lg-4 mb-1 mb-lg-2'>AN EXCLUSIVE SELECTION OF THIS SEASON’S TRENDS.</p>
                <p className='mb-3 mb-lg-5'><strong>EXCLUSIVELY ONLINE!</strong></p>

                <Link to='/products'>
                    <Button variant='light' className='rounded-pill'>Shop Now</Button>
                </Link>
            </div>
        </div>
    )
}