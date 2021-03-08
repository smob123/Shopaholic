/**
 * header for all pages except home and 404.
 */
import { Link } from 'react-router-dom';

export default function Header({ title, pageTitle }) {
    return (
        <header className='header'>
            <div className='content'>
                {title &&
                    <h3>{title}</h3>
                }
                <nav className='d-flex flex-wrap align-items-center justify-content-center'>
                    <Link to='/'>
                        Home
                    </Link>

                    <span className='mx-2'>/</span>

                    <span className='d-inline-block red-text'>
                        {pageTitle}
                    </span>
                </nav>
            </div>
        </header>
    );
}