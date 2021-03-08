import { Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';

export default function Header() {
    return (
        <div className='home-header-container'>
            <header className='home-header'>
                <div className='content'>
                    <div>
                        <p className='mb-1'>Big Sale up to 50% off</p>
                        <h1>THE BLACK</h1>
                        <p className='uppercase'>
                            An exclusive selection of this season’s trends.
                                <span className='medium-text d-block uppercase font-bold'>
                                Exclusively online
                                </span>
                        </p>
                        <Link to={'/products'}>
                            <Button variant='outline-light' className='mt-4 uppercase'>
                                Shop Now
                            </Button>
                        </Link>
                    </div>
                </div>
            </header>
        </div>
    );
}