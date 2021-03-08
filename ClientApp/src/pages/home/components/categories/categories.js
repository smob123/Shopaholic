/**
 * links to various product categories.
 */

import { Container, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';

import Category1 from '../../images/category1.jpg';
import Category2 from '../../images/category2.jpg';
import Category3 from '../../images/category3.jpg';
import Category4 from '../../images/category4.jpg';

export default function Categories() {
    return (
        <Container fluid className='categories responsive-width'>
            <Row xs={1} md={2} lg={4}>
                <Col as={Link} to='/products'>
                    <div className='image-container mb-2'>
                        <img src={Category1} alt='category1' />
                    </div>
                    <p className='uppercase mb-2'>
                        Running shoes
                    </p>
                    <div className='d-flex justify-content-between'>
                        <p>20 Products</p>

                        <p>Shop Collection</p>
                    </div>
                </Col>

                <Col as={Link} to='/products'>
                    <div className='image-container mb-2'>
                        <img src={Category2} alt='category2' />
                    </div>
                    <p className='uppercase mb-2'>
                        Tennis Shoes
                    </p>
                    <div className='d-flex justify-content-between'>
                        <p>20 Products</p>

                        <p>Shop Collection</p>
                    </div>
                </Col>

                <Col as={Link} to='/products'>
                    <div className='image-container mb-2'>
                        <img src={Category3} alt='category3' />
                    </div>
                    <p className='uppercase mb-2'>
                        Fitness Shoes
                    </p>
                    <div className='d-flex justify-content-between'>
                        <p>20 Products</p>

                        <p>Shop Collection</p>
                    </div>
                </Col>

                <Col as={Link} to='/products'>
                    <div className='image-container mb-2'>
                        <img src={Category4} alt='category4' />
                    </div>
                    <p className='uppercase mb-2'>
                        Football shoes
                    </p>
                    <div className='d-flex justify-content-between'>
                        <p>20 Products</p>

                        <p>Shop Collection</p>
                    </div>
                </Col>
            </Row>
        </Container>
    );
}